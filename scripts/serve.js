/* Static server that mirrors GitHub Pages routing for local testing.
   - Known path  -> the file is served with the right Content-Type.
   - Directory   -> index.html is served.
   - Unknown path-> 404.html body is served with HTTP status 404 (URL preserved). */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 4000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function send(res, status, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(status, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
  const safePath = path.normalize(path.join(ROOT, urlPath));
  if (safePath !== ROOT && !safePath.startsWith(ROOT + path.sep)) {
    send(res, 403, path.join(ROOT, '404.html'));
    return;
  }

  fs.stat(safePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      const index = path.join(safePath, 'index.html');
      fs.stat(index, (e2, s2) => {
        if (!e2 && s2.isFile()) send(res, 200, index);
        else send(res, 404, path.join(ROOT, '404.html'));
      });
      return;
    }
    if (!err && stat.isFile()) {
      send(res, 200, safePath);
      return;
    }
    send(res, 404, path.join(ROOT, '404.html'));
  });
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
});
