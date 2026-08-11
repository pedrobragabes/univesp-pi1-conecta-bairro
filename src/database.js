import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const schema = `
  CREATE TABLE IF NOT EXISTS solicitacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL CHECK(length(titulo) BETWEEN 5 AND 100),
    descricao TEXT NOT NULL CHECK(length(descricao) BETWEEN 10 AND 1000),
    categoria TEXT NOT NULL CHECK(categoria IN ('Infraestrutura', 'Limpeza', 'Iluminação', 'Acessibilidade', 'Segurança', 'Outros')),
    prioridade TEXT NOT NULL DEFAULT 'Média' CHECK(prioridade IN ('Baixa', 'Média', 'Alta')),
    localizacao TEXT NOT NULL CHECK(length(localizacao) BETWEEN 3 AND 150),
    solicitante TEXT NOT NULL CHECK(length(solicitante) BETWEEN 2 AND 80),
    contato TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Aberta' CHECK(status IN ('Aberta', 'Em andamento', 'Concluída')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

const seedRows = [
  ['Lâmpada apagada na praça', 'O poste próximo ao parquinho está sem iluminação há duas semanas.', 'Iluminação', 'Alta', 'Praça das Flores', 'Ana Souza', 'ana@example.com', 'Em andamento'],
  ['Rampa de acesso danificada', 'A rampa da entrada do centro comunitário apresenta uma rachadura e precisa de reparo.', 'Acessibilidade', 'Alta', 'Centro Comunitário', 'Carlos Lima', '', 'Aberta'],
  ['Coleta de recicláveis', 'Solicitação de um ponto de entrega voluntária para papel, plástico e metal.', 'Limpeza', 'Média', 'Rua das Palmeiras, 120', 'Marina Alves', 'marina@example.com', 'Concluída'],
  ['Buraco próximo à escola', 'Há um buraco grande na faixa de travessia utilizada pelos estudantes.', 'Infraestrutura', 'Alta', 'Av. Central, 45', 'João Santos', '', 'Aberta'],
];

export function createDatabase({ filename, seed = true } = {}) {
  const dbPath = filename || resolve(projectRoot, 'data', 'conecta-bairro.db');
  if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });

  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  db.exec(schema);

  const count = db.prepare('SELECT COUNT(*) AS total FROM solicitacoes').get().total;
  if (seed && count === 0) {
    const insert = db.prepare(`
      INSERT INTO solicitacoes
        (titulo, descricao, categoria, prioridade, localizacao, solicitante, contato, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    db.exec('BEGIN');
    try {
      for (const row of seedRows) insert.run(...row);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }

  return {
    list({ status = '', categoria = '', busca = '' } = {}) {
      const clauses = [];
      const params = [];
      if (status) { clauses.push('status = ?'); params.push(status); }
      if (categoria) { clauses.push('categoria = ?'); params.push(categoria); }
      if (busca) {
        clauses.push('(titulo LIKE ? OR descricao LIKE ? OR localizacao LIKE ?)');
        const term = `%${busca}%`;
        params.push(term, term, term);
      }
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      return db.prepare(`SELECT * FROM solicitacoes ${where} ORDER BY CASE prioridade WHEN 'Alta' THEN 1 WHEN 'Média' THEN 2 ELSE 3 END, datetime(created_at) DESC`).all(...params);
    },
    latest(limit = 5) {
      return db.prepare('SELECT * FROM solicitacoes ORDER BY datetime(created_at) DESC, id DESC LIMIT ?').all(limit);
    },
    find(id) {
      return db.prepare('SELECT * FROM solicitacoes WHERE id = ?').get(id);
    },
    create(item) {
      const result = db.prepare(`
        INSERT INTO solicitacoes (titulo, descricao, categoria, prioridade, localizacao, solicitante, contato)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(item.titulo, item.descricao, item.categoria, item.prioridade, item.localizacao, item.solicitante, item.contato);
      return Number(result.lastInsertRowid);
    },
    update(id, item) {
      return db.prepare(`
        UPDATE solicitacoes
        SET titulo = ?, descricao = ?, categoria = ?, prioridade = ?, localizacao = ?, solicitante = ?, contato = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(item.titulo, item.descricao, item.categoria, item.prioridade, item.localizacao, item.solicitante, item.contato, id).changes;
    },
    updateStatus(id, status) {
      return db.prepare('UPDATE solicitacoes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id).changes;
    },
    remove(id) {
      return db.prepare('DELETE FROM solicitacoes WHERE id = ?').run(id).changes;
    },
    indicators() {
      const totals = db.prepare(`
        SELECT COUNT(*) AS total,
          COALESCE(SUM(CASE WHEN status = 'Aberta' THEN 1 ELSE 0 END), 0) AS abertas,
          COALESCE(SUM(CASE WHEN status = 'Em andamento' THEN 1 ELSE 0 END), 0) AS andamento,
          COALESCE(SUM(CASE WHEN status = 'Concluída' THEN 1 ELSE 0 END), 0) AS concluidas
        FROM solicitacoes
      `).get();
      const categories = db.prepare('SELECT categoria, COUNT(*) AS total FROM solicitacoes GROUP BY categoria ORDER BY total DESC, categoria').all();
      return { ...totals, categories };
    },
    close() { db.close(); },
  };
}
