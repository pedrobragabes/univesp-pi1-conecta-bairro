import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const routes = new Map([
  ['/report.docx', [resolve(root, 'entregas', 'Relatorio_Final_Conecta_Bairro.docx'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']],
  ['/jszip.min.js', [resolve(root, 'node_modules', 'jszip', 'dist', 'jszip.min.js'), 'text/javascript']],
  ['/docx-preview.min.js', [resolve(root, 'node_modules', 'docx-preview', 'dist', 'docx-preview.min.js'), 'text/javascript']],
]);

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Verificação do relatório</title>
  <style>
    body { margin: 0; padding: 24px; background: #7f8582; }
    #status { position: fixed; top: 8px; right: 8px; z-index: 10; background: #fff; padding: 6px 10px; font: 13px sans-serif; }
    .docx-wrapper { padding: 20px !important; }
    .docx-wrapper > section.docx { box-shadow: 0 4px 16px rgba(0,0,0,.25); margin-bottom: 24px; }
  </style>
</head>
<body>
  <div id="status">Renderizando…</div>
  <div id="container"></div>
  <script src="/jszip.min.js"></script>
  <script src="/docx-preview.min.js"></script>
  <script>
    fetch('/report.docx')
      .then(response => response.arrayBuffer())
      .then(buffer => docx.renderAsync(buffer, document.getElementById('container'), null, {
        className: 'docx', inWrapper: true, breakPages: true, renderHeaders: true,
        renderFooters: true, renderFootnotes: true, useBase64URL: true
      }))
      .then(() => { document.getElementById('status').textContent = 'Pronto'; document.body.dataset.ready = 'true'; })
      .catch(error => { document.getElementById('status').textContent = error.message; document.body.dataset.ready = 'error'; });
  </script>
</body>
</html>`;

const server = createServer((request, response) => {
  if (request.url === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return response.end(html);
  }
  const file = routes.get(request.url);
  if (!file) {
    response.writeHead(404);
    return response.end('Não encontrado');
  }
  response.writeHead(200, { 'content-type': file[1] });
  createReadStream(file[0]).pipe(response);
});

server.listen(3100, '127.0.0.1', () => console.log('Prévia em http://127.0.0.1:3100'));

