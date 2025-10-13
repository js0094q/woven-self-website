import { connect } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, message } = req.body;

        const client = await connect();
        const result = await client.sql`INSERT INTO contacts (name, email, message) VALUES (${name}, ${email}, ${message})`;

        res.status(200).json({ status: 'success', data: result });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}