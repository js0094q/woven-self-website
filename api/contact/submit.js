import { connect } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { name, email, phone = null, message } = req.body ?? {};

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const cleanName = String(name).trim().slice(0, 200);
    const cleanEmail = String(email).trim().slice(0, 254);
    const cleanPhone = phone ? String(phone).trim().slice(0, 50) : null;
    const cleanMessage = String(message).trim().slice(0, 2000);

    const client = await connect();
    const result = await client.sql`
      INSERT INTO contacts (name, email, phone, message, created_at)
      VALUES (${cleanName}, ${cleanEmail}, ${cleanPhone}, ${cleanMessage}, now())
      RETURNING id, created_at
    `;

    return res.status(200).json({ ok: true, id: result?.rows?.[0]?.id ?? null, created_at: result?.rows?.[0]?.created_at ?? null });
  } catch (err) {
    console.error('Contact submit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}