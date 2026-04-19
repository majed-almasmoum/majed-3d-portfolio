const { req } = require('./_http');

module.exports = async function(request, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (request.method !== 'GET') return res.status(405).end();
  try {
    const REPO  = 'majed-almasmoum/majed-3d-portfolio';
    const TOKEN = process.env.GITHUB_TOKEN;
    const hdrs  = { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': '3d-portfolio' };
    const r = await req('GET', `https://api.github.com/repos/${REPO}/contents/works.json`, hdrs);
    if (!r.ok) return res.json([]);
    const data = r.json();
    return res.json(JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')));
  } catch (e) { return res.json([]); }
};
