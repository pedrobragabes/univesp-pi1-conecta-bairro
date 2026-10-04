import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const categories = ['Infraestrutura', 'Limpeza', 'Iluminação', 'Acessibilidade', 'Segurança', 'Outros'];
const priorities = ['Baixa', 'Média', 'Alta'];
const statuses = ['Aberta', 'Em andamento', 'Concluída'];

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) body = {};
  const item = {
    titulo: clean(body.titulo),
    descricao: clean(body.descricao),
    categoria: clean(body.categoria),
    prioridade: clean(body.prioridade),
    localizacao: clean(body.localizacao),
    solicitante: clean(body.solicitante),
    contato: clean(body.contato),
  };
  const errors = [];
  if (item.titulo.length < 5 || item.titulo.length > 100) errors.push('O título deve ter entre 5 e 100 caracteres.');
  if (item.descricao.length < 10 || item.descricao.length > 1000) errors.push('A descrição deve ter entre 10 e 1.000 caracteres.');
  if (!categories.includes(item.categoria)) errors.push('Selecione uma categoria válida.');
  if (!priorities.includes(item.prioridade)) errors.push('Selecione uma prioridade válida.');
  if (item.localizacao.length < 3 || item.localizacao.length > 150) errors.push('Informe uma localização válida.');
  if (item.solicitante.length < 2 || item.solicitante.length > 80) errors.push('Informe o nome do solicitante.');
  if (item.contato.length > 120) errors.push('O contato deve ter no máximo 120 caracteres.');
  return { item, errors };
}

function addSecurityHeaders(req, res, next) {
  res.set({
    'Content-Security-Policy': "default-src 'self'; base-uri 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self'",
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
  next();
}

function rejectCrossSiteWrites(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('sec-fetch-site') === 'cross-site') return res.status(403).send('Requisição entre sites bloqueada.');

  const origin = req.get('origin');
  if (origin) {
    try {
      const expected = new URL(`${req.protocol}://${req.get('host')}`).origin;
      if (new URL(origin).origin !== expected) return res.status(403).send('Origem não permitida.');
    } catch {
      return res.status(403).send('Origem inválida.');
    }
  }
  next();
}

export function createApp({ database }) {
  if (!database) throw new Error('A dependência database é obrigatória.');

  const app = express();
  app.disable('x-powered-by');
  app.set('view engine', 'ejs');
  app.set('views', resolve(projectRoot, 'views'));
  app.use(addSecurityHeaders);
  app.use(rejectCrossSiteWrites);
  app.use(express.urlencoded({ extended: false, limit: '20kb' }));
  app.use(express.json({ limit: '20kb' }));
  app.use(express.static(resolve(projectRoot, 'public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
  }));

  app.use((req, res, next) => {
    res.locals.path = req.path;
    res.locals.categories = categories;
    res.locals.priorities = priorities;
    res.locals.statuses = statuses;
    res.locals.formatDate = (value) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${value.replace(' ', 'T')}Z`));
    res.locals.statusClass = (value) => ({ 'Aberta': 'aberta', 'Em andamento': 'andamento', 'Concluída': 'concluida' }[value] || '');
    next();
  });

  app.get('/', (req, res) => {
    res.render('index', { title: 'Painel comunitário', indicators: database.indicators(), latest: database.latest() });
  });

  app.get('/solicitacoes', (req, res) => {
    const filters = { status: clean(req.query.status), categoria: clean(req.query.categoria), busca: clean(req.query.busca) };
    res.render('solicitacoes/index', { title: 'Solicitações', items: database.list(filters), filters });
  });

  app.get('/solicitacoes/nova', (req, res) => {
    res.render('solicitacoes/form', { title: 'Nova solicitação', item: { prioridade: 'Média' }, errors: [], action: '/solicitacoes', submitLabel: 'Registrar solicitação' });
  });

  app.post('/solicitacoes', (req, res) => {
    const { item, errors } = validate(req.body);
    if (errors.length) return res.status(422).render('solicitacoes/form', { title: 'Nova solicitação', item, errors, action: '/solicitacoes', submitLabel: 'Registrar solicitação' });
    const id = database.create(item);
    res.redirect(`/solicitacoes/${id}?criada=1`);
  });

  app.get('/solicitacoes/:id', (req, res, next) => {
    const item = database.find(Number(req.params.id));
    if (!item) return next();
    res.render('solicitacoes/show', { title: item.titulo, item, created: req.query.criada === '1', updated: req.query.atualizada === '1' });
  });

  app.get('/solicitacoes/:id/editar', (req, res, next) => {
    const item = database.find(Number(req.params.id));
    if (!item) return next();
    res.render('solicitacoes/form', { title: 'Editar solicitação', item, errors: [], action: `/solicitacoes/${item.id}/editar`, submitLabel: 'Salvar alterações' });
  });

  app.post('/solicitacoes/:id/editar', (req, res, next) => {
    const current = database.find(Number(req.params.id));
    if (!current) return next();
    const { item, errors } = validate(req.body);
    item.id = current.id;
    if (errors.length) return res.status(422).render('solicitacoes/form', { title: 'Editar solicitação', item, errors, action: `/solicitacoes/${current.id}/editar`, submitLabel: 'Salvar alterações' });
    database.update(current.id, item);
    res.redirect(`/solicitacoes/${current.id}?atualizada=1`);
  });

  app.post('/solicitacoes/:id/status', (req, res, next) => {
    const status = clean(req.body?.status);
    if (!statuses.includes(status)) return res.status(422).send('Status inválido.');
    if (!database.updateStatus(Number(req.params.id), status)) return next();
    res.redirect(`/solicitacoes/${req.params.id}?atualizada=1`);
  });

  app.get('/solicitacoes/:id/excluir', (req, res, next) => {
    const item = database.find(Number(req.params.id));
    if (!item) return next();
    res.render('solicitacoes/excluir', { title: 'Confirmar exclusão', item });
  });

  app.post('/solicitacoes/:id/excluir', (req, res, next) => {
    if (req.body?.confirmar !== 'sim') return res.status(422).send('Confirme a exclusão na página da solicitação.');
    if (!database.remove(Number(req.params.id))) return next();
    res.redirect('/solicitacoes?excluida=1');
  });

  app.get('/api/indicadores', (req, res) => res.json(database.indicators()));

  app.get('/sobre', (req, res) => res.render('sobre', { title: 'Sobre o projeto' }));

  app.use((req, res) => res.status(404).render('404', { title: 'Página não encontrada' }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') {
      const status = error.type === 'entity.too.large' ? 413 : 400;
      return res.status(status).send(status === 413 ? 'O formulário excede o limite de envio.' : 'O corpo da requisição é inválido.');
    }
    console.error('Falha interna ao processar a requisição.');
    res.status(500).render('500', { title: 'Erro interno' });
  });

  return app;
}
