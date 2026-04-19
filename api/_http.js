// helper used by all api functions
const https = require('https');

function req(method, urlStr, headers, body) {
  return new Promise((resolve, reject) => {
    const u    = new URL(urlStr);
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: u.hostname,
      path:     u.pathname + u.search,
      method,
      headers: {
        ...headers,
        ...(data && { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }),
      },
    };
    const r = https.request(opts, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => resolve({ ok: res.statusCode < 300, status: res.statusCode, json: () => JSON.parse(raw) }));
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

module.exports = { req };
