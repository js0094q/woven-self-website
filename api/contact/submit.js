import { connect } from '@vercel/postgres';
import sgMail from '@sendgrid/mail';

const SENDGRID_KEY = process.env.SENDGRID_API_KEY || '';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || ''; // e.g. your email to notify
const FORM_SECRET = process.env.FORM_SECRET || ''; // optional: if set, server requires the header x-form-secret to match

if (SENDGRID_KEY) {
  sgMail.setApiKey(SENDGRID_KEY);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Optional server-side check for a secret header to reduce spam/abuse
    if (FORM_SECRET) {
      const headerSecret = String(req.headers['x-form-secret'] || '');
      if (!headerSecret || headerSecret !== FORM_SECRET) {
        // Respond 403 to unauthorized submissions
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    const { name, email, phone = null, message, website = '' } = req.body ?? {};

    // Honeypot: reject silently if the honeypot field is filled
    if (website && website.trim() !== '') {
      // pretend success to discourage bots and avoid back-and-forth
      return res.status(200).json({ ok: true });
    }

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize / trim
    const cleanName = String(name).trim().slice(0, 200);
    const cleanEmail = String(email).trim().slice(0, 254);
    const cleanPhone = phone ? String(phone).trim().slice(0, 50) : null;
    const cleanMessage = String(message).trim().slice(0, 2000);

    // Insert into Postgres via Vercel Postgres client (Neon)
    const client = await connect();
    const result = await client.sql`
      INSERT INTO contacts (name, email, phone, message, created_at)
      VALUES (${cleanName}, ${cleanEmail}, ${cleanPhone}, ${cleanMessage}, now())
      RETURNING id, created_at
    `;

    const inserted = result?.rows?.[0] ?? null;

    // Optional: send notification email via SendGrid (if configured)
    if (SENDGRID_KEY && NOTIFY_EMAIL && inserted) {
      try {
        const emailBody = `
You received a new contact form submission.

Name: ${cleanName}
Email: ${cleanEmail}
Phone: ${cleanPhone || '(none)'}
Message:
${cleanMessage}

Record ID: ${inserted.id}
Received: ${inserted.created_at}
        `;

        await sgMail.send({
          to: NOTIFY_EMAIL,
          from: NOTIFY_EMAIL, // use a verified sender or a dedicated from address you own
          subject: `New contact: ${cleanName}`,
          text: emailBody,
        });
      } catch (mailErr) {
        // Log mail errors but do not fail the request
        console.error('SendGrid error:', mailErr);
      }
    }

    return res.status(200).json({
      ok: true,
      id: inserted?.id ?? null,
      created_at: inserted?.created_at ?? null,
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
