module.exports = async function (req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
if (req.method !== ‘GET’) return res.status(405).end();

try {
const REPO  = ‘majed-almasmoum/majed-3d-portfolio’;
const TOKEN = process.env.GITHUB_TOKEN;
const url   = `https://api.github.com/repos/${REPO}/contents/works.json`;
const hdrs  = {
Authorization: `token ${TOKEN}`,
Accept: ‘application/vnd.github.v3+json’,
‘User-Agent’: ‘3d-portfolio’,
};

```
const get = await fetch(url, { headers: hdrs });
if (!get.ok) return res.json([]);

const data  = await get.json();
const works = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
return res.json(works);
```

} catch (e) {
return res.json([]);
}
};
