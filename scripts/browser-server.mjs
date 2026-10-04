import { createApp } from '../src/app.js';
import { createDatabase } from '../src/database.js';

const database = createDatabase({ filename: ':memory:', seed: true });
const server = createApp({ database }).listen(3485, '127.0.0.1');
function close() { server.close(() => { database.close(); process.exit(0); }); }
process.on('SIGINT', close);
process.on('SIGTERM', close);
