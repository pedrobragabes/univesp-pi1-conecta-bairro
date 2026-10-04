import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { createApp } from '../src/app.js';
import { createDatabase } from '../src/database.js';

async function withServer(run) {
  const database = createDatabase({ filename: ':memory:', seed: false });
  const server = createApp({ database }).listen(0);
  await once(server, 'listening');
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  try { await run({ baseUrl, database }); }
  finally { await new Promise((resolve) => server.close(resolve)); database.close(); }
}

test('painel responde e expõe indicadores zerados', () => withServer(async ({ baseUrl }) => {
  const page = await fetch(baseUrl);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Pulso da comunidade/);
  const api = await fetch(`${baseUrl}/api/indicadores`);
  assert.deepEqual(await api.json(), { total: 0, abertas: 0, andamento: 0, concluidas: 0, categories: [] });
}));

test('fluxo CRUD cria, consulta, atualiza e exclui uma solicitação', () => withServer(async ({ baseUrl, database }) => {
  const body = new URLSearchParams({
    titulo: 'Faixa de pedestres apagada',
    descricao: 'A pintura está apagada em frente à unidade de saúde.',
    categoria: 'Segurança',
    prioridade: 'Alta',
    localizacao: 'Rua Central, 10',
    solicitante: 'Pessoa Teste',
    contato: '',
  });
  const created = await fetch(`${baseUrl}/solicitacoes`, { method: 'POST', body, redirect: 'manual' });
  assert.equal(created.status, 302);
  assert.equal(database.indicators().total, 1);
  const id = database.list()[0].id;
  const detail = await fetch(`${baseUrl}/solicitacoes/${id}`);
  assert.match(await detail.text(), /Faixa de pedestres apagada/);

  const status = await fetch(`${baseUrl}/solicitacoes/${id}/status`, { method: 'POST', body: new URLSearchParams({ status: 'Concluída' }), redirect: 'manual' });
  assert.equal(status.status, 302);
  assert.equal(database.find(id).status, 'Concluída');

  const removed = await fetch(`${baseUrl}/solicitacoes/${id}/excluir`, { method: 'POST', body: new URLSearchParams({ confirmar: 'sim' }), redirect: 'manual' });
  assert.equal(removed.status, 302);
  assert.equal(database.find(id), undefined);
}));

test('validação rejeita dados incompletos', () => withServer(async ({ baseUrl, database }) => {
  const response = await fetch(`${baseUrl}/solicitacoes`, { method: 'POST', body: new URLSearchParams({ titulo: 'Oi' }) });
  assert.equal(response.status, 422);
  assert.match(await response.text(), /Revise os campos/);
  assert.equal(database.indicators().total, 0);
}));

test('escrita iniciada por outro site é bloqueada', () => withServer(async ({ baseUrl, database }) => {
  const response = await fetch(`${baseUrl}/solicitacoes`, {
    method: 'POST',
    headers: { 'sec-fetch-site': 'cross-site' },
    body: new URLSearchParams({ titulo: 'Cadastro externo indevido' }),
  });
  assert.equal(response.status, 403);
  assert.equal(database.indicators().total, 0);
}));

test('respostas incluem cabeçalhos defensivos', () => withServer(async ({ baseUrl }) => {
  const response = await fetch(baseUrl);
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
}));

const fixture = {
  titulo: 'Pedido sintético de teste', descricao: 'Descrição sintética para validar o fluxo local.',
  categoria: 'Limpeza', prioridade: 'Média', localizacao: 'Local de demonstração',
  solicitante: 'Pessoa Fictícia', contato: '',
};

test('cadastro sem corpo retorna validação e não grava', () => withServer(async ({ baseUrl, database }) => {
  const response = await fetch(`${baseUrl}/solicitacoes`, { method: 'POST' });
  assert.equal(response.status, 422);
  assert.equal(database.indicators().total, 0);
}));

test('status sem corpo não provoca erro interno nem alteração', () => withServer(async ({ baseUrl, database }) => {
  const id = database.create(fixture);
  const response = await fetch(`${baseUrl}/solicitacoes/${id}/status`, { method: 'POST' });
  assert.equal(response.status, 422);
  assert.equal(database.find(id).status, 'Aberta');
}));

test('JSON malformado ou excessivo retorna 400/413 sem gravação', () => withServer(async ({ baseUrl, database }) => {
  const malformed = await fetch(`${baseUrl}/solicitacoes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' });
  assert.equal(malformed.status, 400);
  const large = await fetch(`${baseUrl}/solicitacoes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ titulo: 'a'.repeat(25000) }) });
  assert.equal(large.status, 413);
  assert.equal(database.indicators().total, 0);
}));

test('exclusão apresenta confirmação HTML e exige intenção explícita', () => withServer(async ({ baseUrl, database }) => {
  const id = database.create(fixture);
  const confirmation = await fetch(`${baseUrl}/solicitacoes/${id}/excluir`);
  assert.equal(confirmation.status, 200);
  assert.match(await confirmation.text(), /Confirmar exclusão/);
  assert.equal(database.find(id).titulo, fixture.titulo);
  const rejected = await fetch(`${baseUrl}/solicitacoes/${id}/excluir`, { method: 'POST', redirect: 'manual' });
  assert.equal(rejected.status, 422);
  assert.equal(database.find(id).titulo, fixture.titulo);
}));

test('confirmação de exclusão inexistente retorna 404', () => withServer(async ({ baseUrl }) => {
  const response = await fetch(`${baseUrl}/solicitacoes/999/excluir`);
  assert.equal(response.status, 404);
}));

test('arquivo SQLite preserva edição e status após fechar e reabrir', () => {
  const temporaryRoot = resolve(tmpdir());
  const directory = mkdtempSync(join(temporaryRoot, 'conecta-persist-'));
  const filename = join(directory, 'fixture.db');
  let database;
  try {
    database = createDatabase({ filename, seed: false });
    const id = database.create(fixture);
    database.update(id, { ...fixture, localizacao: 'Local corrigido antes do reinício' });
    database.updateStatus(id, 'Concluída');
    database.close(); database = undefined;
    database = createDatabase({ filename, seed: false });
    assert.equal(database.find(id).localizacao, 'Local corrigido antes do reinício');
    assert.equal(database.find(id).status, 'Concluída');
    assert.equal(database.indicators().total, 1);
    assert.equal(database.indicators().concluidas, 1);
  } finally {
    database?.close();
    assert.equal(dirname(resolve(directory)), temporaryRoot);
    assert.ok(basename(directory).startsWith('conecta-persist-'));
    rmSync(directory, { recursive: true, force: true });
  }
});
