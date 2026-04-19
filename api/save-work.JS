module.exports = async function (req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST,OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type,x-admin-password’);
if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).end();

if (req.headers[‘x-admin-password’] !== process.env.ADMIN_PASSWORD)
return res.status(401).json({ error: ‘غير مصرح’ });

try {
const { work } = req.body;
if (!work) return res.status(400).json({ error: ‘work مطلوب’ });

```
const REPO  = 'majed-almasmoum/majed-3d-portfolio';
const TOKEN = process.env.GITHUB_TOKEN;
const url   = `https://api.github.com/repos/${REPO}/contents/works.json`;
const hdrs  = {
  Authorization: `token ${TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  'User-Agent': '3d-portfolio',
};

let works = [], sha;
const get = await fetch(url, { headers: hdrs });
if (get.ok) {
  const data = await get.json();
  sha   = data.sha;
  works = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
}

const newWork = { ...work, id: Date.now(), addedAt: new Date().toISOString() };
works.unshift(newWork);

const put = await fetch(url, {
  method: 'PUT',
  headers: hdrs,
  body: JSON.stringify({
    message: `Add work: ${work.name}`,
    content: Buffer.from(JSON.stringify(works, null, 2), 'utf-8').toString('base64'),
    ...(sha && { sha }),
  }),
});

if (!put.ok) return res.status(500).json({ error: (await put.json()).message });
return res.json({ success: true, id: newWork.id });
```

} catch (e) {
return res.status(500).json({ error: e.message });
}
};
