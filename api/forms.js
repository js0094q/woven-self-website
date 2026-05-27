const rateBuckets = new Map();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || 'https://formspree.io/f/myzndadj';

const isBlank = (value) => {
  return !value || String(value).trim().length === 0;
};

const getIp = (req) => {
  const direct = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '').toString();
  if (!direct) return 'unknown';
  return direct.split(',')[0].trim();
};

const parseRawBody = (raw) => {
  try {
    return JSON.parse(raw || '{}');
  } catch (_error) {
    try {
      const data = new URLSearchParams(raw);
      return Object.fromEntries(data.entries());
    } catch (_searchErr) {
      return {};
    }
  }
};

const parseBody = async (req) => {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
    return parseRawBody(req.body.toString());
  }

  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
  }

  return parseRawBody(raw);
};

const isRateLimited = (key) => {
  const now = Date.now();
  const bucket = rateBuckets.get(key) || [];
  const nextBucket = bucket.filter((time) => now - time < WINDOW_MS);

  if (nextBucket.length >= MAX_PER_WINDOW) {
    return true;
  }

  nextBucket.push(now);
  rateBuckets.set(key, nextBucket);
  return false;
};

const verifyTurnstile = async (token, ip) => {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) {
    return true;
  }

  if (!token) {
    return false;
  }

  const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ secret, response: token, remoteip: ip })
  });

  if (!verifyResponse.ok) {
    return false;
  }

  const payload = await verifyResponse.json();
  return Boolean(payload.success);
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
  }

  res.setHeader('Content-Type', 'application/json');

  try {
    const payload = await parseBody(req);
    const ip = getIp(req);
    const honeypot = (payload.website || '').trim();

    if (honeypot) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ ok: false, error: 'Invalid form submission' }));
    }

    const formType = payload.form_type || 'lead';
    const email = (payload.email || payload.contact_email || '').trim().toLowerCase();

    if (!email) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ ok: false, error: 'Email is required' }));
    }

    const key = [email, ip].filter(Boolean).join('|');
    if (isRateLimited(key)) {
      res.statusCode = 429;
      return res.end(JSON.stringify({ ok: false, error: 'Too many submissions. Please wait and try again.' }));
    }

    const cleaned = {};
    const allowedKeys = new Set([
      'name',
      'first_name',
      'email',
      'phone',
      'sequence_name',
      'sequence_step',
      'lead_magnet',
      'message',
      'contact_email',
      'form_type',
      'form_name',
      'cf-turnstile-token',
      'cf-turnstile-response',
      'source',
      '_subject',
      '_source',
      'website'
    ]);

    Object.entries(payload).forEach(([k, v]) => {
      if (allowedKeys.has(k) && typeof v === 'string') {
        cleaned[k] = v;
      }
    });

    if (formType === 'contact' && isBlank(cleaned.message)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ ok: false, error: 'Message is required' }));
    }

    if (!await verifyTurnstile(cleaned['cf-turnstile-token'] || cleaned['cf-turnstile-response'], ip)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ ok: false, error: 'Turnstile challenge failed' }));
    }

    const formspreePayload = new URLSearchParams();
    const safe = {
      ...cleaned,
      _replyto: cleaned.email,
      _subject: cleaned._subject || `New ${formType} submission from wovenself.com`
    };

    Object.entries(safe).forEach(([keyName, value]) => {
      if (typeof value === 'string' && value.trim().length > 0) {
        formspreePayload.set(keyName, value);
      }
    });

    const formspreeResponse = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formspreePayload
    });

    if (!formspreeResponse.ok) {
      const bodyText = await formspreeResponse.text().catch(() => '');
      res.statusCode = 502;
      return res.end(JSON.stringify({ ok: false, error: `Form relay failed: ${bodyText || 'upstream error'}` }));
    }

    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true, message: 'Thanks for submitting', formType }));
  } catch (error) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ ok: false, error: error.message || 'Server error' }));
  }
};
