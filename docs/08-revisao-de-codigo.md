# Revisão de código - versão 1.0.1

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
