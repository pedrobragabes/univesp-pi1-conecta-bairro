# Revisão de código - versão 1.0.2

## Incremento verificado em 04/10/2026

- Quatro regressões de backend reproduzidas e corrigidas: cadastro/status sem corpo, JSON malformado/excessivo e ausência de confirmação HTML para exclusão. Entrada inválida recebe 422, 400 ou 413 conforme o caso e não grava; logs de erro não incluem corpo/contato enviado.
- Exclusão exige página de revisão e envio explícito. GET e Cancelar preservam o registro; o percurso funciona com JavaScript desativado. A confirmação não substitui autorização.
- Navegação móvel permanece visível sem JavaScript. A versão com botão fecha por Escape e devolve o foco; o atalho inicial focaliza o conteúdo.
- Indicadores usam progress nativo com rótulos em vez de estilo inline recusado pela CSP. Atrasos inline da animação foram removidos sem relaxar a política.
- Contraste de textos auxiliares, números da página Sobre e rótulo no painel de status corrigido. Ações pequenas podem quebrar linha em telas estreitas.
- qs 6.16.0, brace-expansion 2.1.7 e docx-preview 0.4.1: audit completo sem alertas conhecidos nesta execução.

Evidências: 11 testes Node, oito Playwright, 22 análises Axe sem violações nos estados examinados e seis páginas sem overflow em 1440, 390 e 320 px. Persistência de edição/status verificada ao fechar e reabrir um arquivo SQLite temporário separado. Não houve ensaio com usuários, implantação pública ou alteração de dados reais. Os resultados automáticos não certificam conformidade completa de acessibilidade.

Os achados abaixo são histórico da fundação. Os bloqueios de produção continuam abertos.

## Escopo

Revisão local da aplicação, banco de dados, templates, JavaScript do navegador, testes e documentação antes da publicação em repositório independente. Foram avaliados bugs, validação, SQL, XSS, requisições entre sites, acessibilidade, privacidade e limites de implantação.

## Achados corrigidos

### P1 - Rotas de escrita aceitavam submissões entre sites

Cadastro, edição, mudança de status e exclusão não recusavam formulários enviados a partir de outro site. Embora não exista sessão autenticada, isso aumentaria o risco de inserções ou alterações indevidas em uma implantação.

**Correção:** escritas marcadas como `cross-site` ou com `Origin` divergente agora retornam `403`. Quando autenticação for implementada, a proteção deverá incluir token CSRF associado à sessão.

### P2 - Respostas sem cabeçalhos defensivos

Não havia política de conteúdo, bloqueio de enquadramento ou restrição de permissões do navegador.

**Correção:** CSP restritivo, `frame-ancestors`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` e `X-Frame-Options` foram adicionados.

### P2 - Cache de desenvolvimento escondia mudanças visuais

CSS e JavaScript recebiam cache de uma hora em todos os ambientes.

**Correção:** cache permanece ativo somente em produção e os assets receberam versão explícita.

### P3 - Página atual não era anunciada semanticamente

O menu usava apenas a classe visual `active`.

**Correção:** o link correspondente agora recebe `aria-current="page"`.

## Riscos aceitos nesta fase

### P1 para produção - ausência de autenticação e autorização

Qualquer visitante local pode editar, alterar status ou excluir registros. Isso é aceitável apenas no MVP acadêmico local. Implantação pública exige contas, papéis, auditoria, recuperação e política de moderação.

### P1 para produção - privacidade e governança ainda não definidas

Nome e contato podem ser armazenados sem consentimento formal, política de retenção ou responsável pelo tratamento. O desenvolvimento e a demonstração devem usar dados fictícios até essas definições existirem.

### P2 - `node:sqlite` experimental

O runtime emite aviso experimental. A versão do Node deve ser fixada e a estratégia de banco reavaliada antes de uma implantação duradoura.

## Verificações

- checagem sintática do servidor, aplicação e banco;
- testes do painel, CRUD, validação, bloqueio entre sites e cabeçalhos;
- consultas SQL parametrizadas;
- escaping padrão do EJS nos dados apresentados;
- `npm audit` sem vulnerabilidades conhecidas;
- documentação informa que os dados iniciais são fictícios;
- pipeline de CI configurado para executar checagem e testes.

## Conclusão

Não há achados bloqueadores para publicar o código como protótipo acadêmico local. Autenticação, autorização, privacidade e governança permanecem bloqueadores explícitos para disponibilizar o sistema como serviço público.
