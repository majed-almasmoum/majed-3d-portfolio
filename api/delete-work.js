module.exports = async function (req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST,OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type,x-admin-password’);
if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).end();

if (req.headers[‘x-admin-password’] !== process.env.ADMIN_PASSWORD)
return res.status(401).json({ error: ‘غير مصرح’ });

try {
const { id } = req.body;
const REPO  = ‘majed-almasmoum/majed-3d-portfolio’;
const TOKEN = process.env.GITHUB_TOKEN;
const url   = `https://api.github.com/repos/${REPO}/contents/works.json`;
const hdrs  = {
Authorization: `token ${TOKEN}`,
Accept: ‘application/vnd.github.v3+json’,
‘Content-Type’: ‘application/json’,
‘User-Agent’: ‘3d-portfolio’,
};

```
const get = await fetch(url, { headers: hdrs });
if (!get.ok) return res.status(500).json({ error: 'تعذّر جلب works.json' });

const data    = await get.json();
const works   = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
const updated = works.filter(w => w.id !== id);

const put = await fetch(url, {
  method: 'PUT',
  headers: hdrs,
  body: JSON.stringify({
    message: `Delete work: ${id}`,
    content: Buffer.from(JSON.stringify(updated, null, 2), 'utf-8').toString('base64'),
    sha: data.sha,
  }),
});

if (!put.ok) return res.status(500).json({ error: (await put.json()).message });
return res.json({ success: true });
```

} catch (e) {
return res.status(500).json({ error: e.message });
}
};
