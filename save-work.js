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
    const { work } = request.body;
    if (!work) return res.status(400).json({ error: 'work مطلوب' });
    const REPO  = 'majed-almasmoum/majed-3d-portfolio';
    const TOKEN = process.env.GITHUB_TOKEN;
    const url   = `https://api.github.com/repos/${REPO}/contents/works.json`;
    const hdrs  = { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': '3d-portfolio' };
    let works = [], sha;
    const get = await req('GET', url, hdrs);
    if (get.ok) { const d = get.json(); sha = d.sha; works = JSON.parse(Buffer.from(d.content, 'base64').toString('utf-8')); }
    const newWork = { ...work, id: Date.now(), addedAt: new Date().toISOString() };
    works.unshift(newWork);
    const put = await req('PUT', url, hdrs, { message: `Add: ${work.name}`, content: Buffer.from(JSON.stringify(works, null, 2)).toString('base64'), ...(sha && { sha }) });
    if (!put.ok) return res.status(500).json({ error: put.json().message });
    return res.json({ success: true, id: newWork.id });
  } catch (e) { return res.status(500).json({ error: e.message }); }
};
