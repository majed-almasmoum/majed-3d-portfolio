module.exports = async function (req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST,OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type,x-admin-password’);
if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).end();

if (req.headers[‘x-admin-password’] !== process.env.ADMIN_PASSWORD)
return res.status(401).json({ error: ‘غير مصرح’ });

try {
const { filename, content } = req.body;
if (!filename || !content)
return res.status(400).json({ error: ‘filename و content مطلوبان’ });

```
const REPO  = 'majed-almasmoum/majed-3d-portfolio';
const TOKEN = process.env.GITHUB_TOKEN;
const path  = `images/${filename}`;
const url   = `https://api.github.com/repos/${REPO}/contents/${path}`;
const hdrs  = {
  Authorization: `token ${TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  'User-Agent': '3d-portfolio',
};

let sha;
const chk = await fetch(url, { headers: hdrs });
if (chk.ok) sha = (await chk.json()).sha;

const put = await fetch(url, {
  method: 'PUT',
  headers: hdrs,
  body: JSON.stringify({ message: `Upload: ${filename}`, content, ...(sha && { sha }) }),
});

if (!put.ok) return res.status(500).json({ error: (await put.json()).message });
return res.json({ path: `/images/${filename}` });
```

} catch (e) {
return res.status(500).json({ error: e.message });
}
};
