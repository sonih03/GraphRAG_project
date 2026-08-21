import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

// 1. Resolve root with fileURLToPath to avoid percent-encoding issues with spaces in path names
const root = fileURLToPath(new URL('.', import.meta.url));

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4'
};

const server = createServer(async (req, res) => {
  try {
    // 2. Decode the URL to handle spaces/special characters
    let requestPath = decodeURIComponent(req.url || '/');

    // 3. Map "/" to "/index.html"
    if (requestPath === '/') {
      requestPath = '/index.html';
    }

    // 4. Resolve absolute path and normalize it
    const filePath = normalize(join(root, requestPath));

    // 5. Directory-traversal guard: reject requests pointing outside root folder
    if (!filePath.startsWith(root)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    // 6. Read file and determine content type
    const fileContent = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // 7. Send success response with Cache-Control: no-store
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store'
    });
    res.end(fileContent);
    console.log(`[200] Served: ${requestPath}`);
  } catch (error) {
    // 8. Any failure returns 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    console.log(`[404] Not Found: ${req.url}`);
  }
});

const PORT = Number(process.env.PORT) || 8123;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`Terranova Static Server is running at http://${HOST}:${PORT}/`);
  console.log(`Root directory: ${root}`);
});
