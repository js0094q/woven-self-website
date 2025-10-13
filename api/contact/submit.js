// api/contact/submit.js
// Forwards contact form submissions to Formspree.
// Environment:
// - FORMSPREE_ENDPOINT (required): e.g. https://formspree.io/f/{yourFormId}
// - FORM_SECRET (optional): if set, client must send header x-form-secret with matching value
// - DEBUG_CONTACT=1 (optional): enable extra console logging

const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || '';
const FORM_SECRET = process.env.FORM_SECRET || '';
const DEBUG = process.env.DEBUG_CONTACT === '1';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    if (DEBUG) console.log('Contact submit called', { headers: req.headers });

    // Optional server-side secret check
    if (FORM_SECRET) {
      const headerSecret = String(req.headers['x-form-secret'] || '');
      if (!headerSecret || headerSecret !== FORM_SECRET) {
        if (DEBUG) console.warn('Form secret mismatch', { headerSecret });
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    const { name, email, phone = null, message, website = '' } = req.body ?? {};

    // Honeypot: if filled, silently accept to avoid back-and-forth with bots
    if (website && website.trim() !== '') {
      if (DEBUG) console.log('Honeypot triggered, ignoring submission');
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !message) {
      const err = { error: 'Missing required fields' };
      if (DEBUG) {
        err.details = {
          namePresent: !!name,
          emailPresent: !!email,
          messagePresent: !!message,
        };
      }
      return res.status(400).json(err);
    }

    // Sanitize/trim fields
    const cleanName = String(name).trim().slice(0, 200);
    const cleanEmail = String(email).trim().slice(0, 254);
    const cleanPhone = phone ? String(phone).trim().slice(0, 50) : '';
    const cleanMessage = String(message).trim().slice(0, 2000);

    if (!FORMSPREE_ENDPOINT) {
      console.error('FORMSPREE_ENDPOINT not configured');
      return res.status(500).json({ error: 'Form endpoint not configured' });
    }

    // Build payload to send to Formspree
    const payload = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || undefined,
      message: cleanMessage,
      // you can add additional metadata here if desired
    };

    if (DEBUG) console.log('Forwarding to Formspree', FORMSPREE_ENDPOINT, payload);

    // Forward to Formspree
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Formspree typically responds with JSON { ok: true } on success; forward status and body
    const responseText = await response.text();
    let responseJson = null;
    try {
      responseJson = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      // keep responseText as fallback
    }

    if (!response.ok) {
      console.error('Formspree error', response.status, responseText);
      return res.status(502).json({
        error: 'Failed to forward to Formspree',
        details: DEBUG ? { status: response.status, body: responseJson ?? responseText } : undefined,
      });
    }

    return res.status(200).json({
      ok: true,
      formspree: responseJson ?? responseText,
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    return res.status(500).json({ error: 'Internal server error', details: DEBUG ? String(err) : undefined });
  }
}
