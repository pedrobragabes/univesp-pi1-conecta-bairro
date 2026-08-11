import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
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

  const removed = await fetch(`${baseUrl}/solicitacoes/${id}/excluir`, { method: 'POST', redirect: 'manual' });
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
