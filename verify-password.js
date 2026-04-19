module.exports = async function(req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type, x-admin-password’);
if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).end();
const pw = req.headers[‘x-admin-password’];
if (!pw || pw !== process.env.ADMIN_PASSWORD)
return res.status(401).json({ ok: false });
return res.json({ ok: true });
};
