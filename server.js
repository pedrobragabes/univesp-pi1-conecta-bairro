import { createApp } from './src/app.js';
import { createDatabase } from './src/database.js';

const port = Number(process.env.PORT || 3000);
const database = createDatabase({
  filename: process.env.DATABASE_PATH,
  seed: process.env.SEED_DATABASE !== 'false',
});
const app = createApp({ database });

const server = app.listen(port, () => {
  console.log(`Conecta Bairro disponível em http://localhost:${port}`);
});

function shutdown() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

