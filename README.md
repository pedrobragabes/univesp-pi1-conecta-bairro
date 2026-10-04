# Conecta Bairro — Projeto Integrador em Computação I

[![CI](https://github.com/pedrobragabes/univesp-pi1-conecta-bairro/actions/workflows/ci.yml/badge.svg)](https://github.com/pedrobragabes/univesp-pi1-conecta-bairro/actions/workflows/ci.yml)
[![CodeQL](https://github.com/pedrobragabes/univesp-pi1-conecta-bairro/actions/workflows/codeql.yml/badge.svg)](https://github.com/pedrobragabes/univesp-pi1-conecta-bairro/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Projeto acadêmico compatível com **PJI110 — Projeto Integrador em Computação I** e com o núcleo do **Projeto Integrador Extensionista I**, conforme a matriz exibida no Portal/AVA da UNIVESP.

## Estado

| Dimensão | Situação |
|---|---|
| fundação técnica | versão 1.0.2 com 11 testes Node, oito E2E e relatório parcial técnico; release histórica `v0.1.0-foundation` |
| entrega acadêmica | pendente de integrantes, parceiro, pesquisa e validação reais |
| dados | somente registros fictícios de demonstração |
| implantação | aplicação local; não preparada para dados pessoais em produção |

O Conecta Bairro é um MVP web para registrar, organizar e acompanhar solicitações comunitárias. A proposta enfrenta um problema recorrente em associações, centros comunitários e pequenos coletivos: demandas recebidas em conversas, mensagens e papéis ficam dispersas, sem histórico único e sem visibilidade de andamento.

## O que está pronto

- cadastro, consulta, edição e exclusão de solicitações;
- alteração de status entre `Aberta`, `Em andamento` e `Concluída`;
- busca textual e filtros por categoria e status;
- painel com totais e distribuição por categoria;
- validação de dados no servidor;
- persistência local em SQLite;
- interface responsiva e navegação por teclado;
- testes automatizados do fluxo principal e da validação.

> **Limite acadêmico importante:** os registros iniciais são dados fictícios de demonstração. Entrevistas, aplicação do questionário e resultados com usuários reais devem ser realizados pela equipe e registrados antes da entrega final. Os documentos não inventam evidências de campo.

## Tecnologias e relação com a ementa

| Item da ementa | Aplicação no projeto |
|---|---|
| Resolução de problemas | recorte de um problema comunitário e construção de um MVP verificável |
| Levantamento de requisitos | requisitos funcionais, não funcionais, histórias e critérios de aceite |
| Framework web | Express 5 |
| HTML | templates semânticos EJS renderizados no servidor |
| CSS | identidade visual própria, layout responsivo e estados de foco |
| Banco de dados | SQLite e consultas parametrizadas |
| Controle de versão | repositório Git, `.gitignore` e estratégia de commits documentada |

## Como executar

Pré-requisitos: Node.js 22.5 ou superior e npm. Após clonar o repositório e entrar em sua pasta:

```powershell
npm ci
npm start
```

Acesse `http://localhost:3000`. O banco `data/conecta-bairro.db` será criado automaticamente com quatro registros fictícios. Para iniciar sem esses registros:

```powershell
$env:SEED_DATABASE="false"
npm start
```

## Verificação

```powershell
npm run check
npm test
npx playwright install chromium
npm run test:e2e
npm audit
```

Os testes HTTP e de navegador usam SQLite em memória. Um teste de persistência cria seu próprio arquivo temporário, fecha e reabre o banco para conferir edição e status; remove apenas essa fixture. Nenhum deles altera o banco de demonstração. A instalação de dependências e Chromium exige download; os testes de navegador iniciam e encerram um servidor somente em `127.0.0.1:3485`.

Na validação de 04/10/2026 passaram 11 testes Node, oito E2E e 22 análises Axe nos estados examinados. O fluxo inclui cadastro, edição, status, filtros, confirmação/cancelamento de exclusão e uso sem JavaScript. Seis páginas foram verificadas em desktop, 390 px e 320 px, sem overflow e sem erro de CSP no console. Audit completo sem alertas conhecidos. Esses resultados são técnicos e sintéticos; não substituem participantes reais.

Excluir abre uma página de confirmação HTML. Apenas o envio explícito de “Confirmar exclusão” remove o registro, inclusive sem JavaScript. Esse passo reduz exclusão acidental; autenticação/autorização continuam ausentes.

## Estrutura

```text
pi1-conecta-bairro/
|-- docs/                  # entregas acadêmicas e instrumentos de pesquisa
|-- public/                # CSS e JavaScript do navegador
|-- src/                   # aplicação Express e acesso ao banco
|-- test/                  # testes automatizados
|-- views/                 # HTML gerado com templates EJS
|-- server.js              # inicialização do servidor
`-- package.json           # dependências e scripts
```

## Documentos acadêmicos

1. [Plano de ação](docs/01-plano-de-acao.md)
2. [Requisitos e modelagem](docs/02-requisitos-e-modelagem.md)
3. [Relatório parcial](docs/03-relatorio-parcial.md)
4. [Relatório final](docs/04-relatorio-final.md)
5. [Roteiro do vídeo](docs/05-roteiro-video.md)
6. [Instrumento de validação](docs/06-questionario-validacao.md)
7. [Plano de entregas semanais](docs/07-entregas-semanais.md)
8. [Revisão de código](docs/08-revisao-de-codigo.md)

## Dados que a equipe precisa completar

Antes da entrega, substitua todos os marcadores `[PREENCHER]` nos relatórios:

- nomes e RAs dos integrantes;
- polo, orientador e município;
- organização/comunidade parceira;
- datas e síntese das entrevistas;
- participantes, resultados e ajustes da validação;
- endereço do repositório e do vídeo.

## Uso de dados e privacidade

O campo de contato é opcional. O MVP é adequado a demonstrações e testes locais, mas ainda não possui autenticação, autorização, consentimento formal nem infraestrutura de produção. Não publique dados pessoais reais antes de implementar esses controles e definir uma política de retenção.

## Governança e licença

As tarefas acadêmicas devem ser registradas em issues e associadas aos milestones do calendário do AVA. Consulte a [política de segurança](SECURITY.md) antes de relatar vulnerabilidades. O código é distribuído sob a [licença MIT](LICENSE); dados e evidências de parceiros continuam sujeitos a autorização própria.
