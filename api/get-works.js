module.exports = async function(req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
if (req.method !== ‘GET’) return res.status(405).end();
try {
const REPO  = ‘majed-almasmoum/majed-3d-portfolio’;
const TOKEN = process.env.GITHUB_TOKEN;
const hdrs  = { Authorization: `token ${TOKEN}`, Accept: ‘application/vnd.github.v3+json’, ‘User-Agent’: ‘3d-portfolio’ };

```
// 1. قراءة works.json (metadata)
let savedWorks = [];
const wRes = await fetch(`https://api.github.com/repos/${REPO}/contents/works.json`, { headers: hdrs });
if (wRes.ok) {
  const d = await wRes.json();
  try { savedWorks = JSON.parse(Buffer.from(d.content, 'base64').toString('utf-8')); } catch(_) {}
}

// 2. قراءة مجلد images/ مباشرة
const iRes = await fetch(`https://api.github.com/repos/${REPO}/contents/images`, { headers: hdrs });
if (!iRes.ok) return res.json(savedWorks);

const files  = await iRes.json();
const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name));

// 3. دمج: إذا الصورة لها entry في works.json استخدمه، وإلا أنشئ واحداً بسيطاً
const savedPaths = new Set(savedWorks.flatMap(w => w.images || []));
const autoWorks  = images
  .filter(f => !savedPaths.has(`/images/${f.name}`))
  .map((f, i) => ({
    id: 9000 + i,
    name: 'عمل مطبوع',
    material: 'PLA',
    printHours: '—',
    colorMethod: 'none',
    description: '',
    images: [`/images/${f.name}`],
    addedAt: '',
  }));

return res.json([...savedWorks, ...autoWorks]);
```

} catch (e) { return res.json([]); }
};
