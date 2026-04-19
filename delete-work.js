const { req } = require('./_http');

module.exports = async function(request, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (request.method === 'OPTIONS') return res.status(200).end();
  if (request.method !== 'POST') return res.status(405).end();
  const pw = request.headers['x-admin-password'];
  if (!pw || pw !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'غير مصرح' });
  try {
    const { id } = request.body;
    const REPO  = 'majed-almasmoum/majed-3d-portfolio';
    const TOKEN = process.env.GITHUB_TOKEN;
    const url   = `https://api.github.com/repos/${REPO}/contents/works.json`;
    const hdrs  = { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': '3d-portfolio' };
    const get = await req('GET', url, hdrs);
    if (!get.ok) return res.status(500).json({ error: 'تعذّر جلب works.json' });
    const d = get.json();
    const works   = JSON.parse(Buffer.from(d.content, 'base64').toString('utf-8'));
    const updated = works.filter(w => w.id !== id);
    const put = await req('PUT', url, hdrs, { message: `Delete: ${id}`, content: Buffer.from(JSON.stringify(updated, null, 2)).toString('base64'), sha: d.sha });
    if (!put.ok) return res.status(500).json({ error: put.json().message });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
};
