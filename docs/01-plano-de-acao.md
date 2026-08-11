# Plano de ação

## 1. Identificação

- **Disciplina:** PJI110 — Projeto Integrador em Computação I
- **Curso:** Eixo de Computação — UNIVESP
- **Título provisório:** Conecta Bairro: sistema web para registro e acompanhamento de solicitações comunitárias
- **Integrantes e RAs:** [PREENCHER]
- **Polo:** [PREENCHER]
- **Orientador(a):** [PREENCHER]
- **Comunidade/organização parceira:** [PREENCHER após aceite]
- **Município:** [PREENCHER]

## 2. Tema e problema

O tema é a organização da comunicação entre uma comunidade local e as pessoas responsáveis por encaminhar suas demandas. O problema investigado é a dispersão de solicitações em canais informais, como mensagens instantâneas, conversas e anotações. Essa dispersão pode dificultar a priorização, causar duplicidade e impedir o acompanhamento do que já foi atendido.

**Questão orientadora:** como uma aplicação web simples pode apoiar o registro, a organização e o acompanhamento transparente de solicitações de uma comunidade local?

O recorte definitivo deverá ser confirmado com uma organização real. A equipe não deve apresentar o problema como validado antes de realizar e registrar essa aproximação.

## 3. Justificativa

A proposta possui escopo compatível com a disciplina: envolve análise de um cenário, levantamento de requisitos, desenvolvimento com framework web, HTML, CSS, banco de dados e controle de versão. Também permite praticar resolução de problemas por meio de ciclos de entendimento, prototipação, teste e melhoria. O produto mínimo pode ser executado localmente e avaliado por usuários sem aquisição de infraestrutura.

## 4. Objetivos

### 4.1 Objetivo geral

Desenvolver e avaliar um protótipo de aplicação web capaz de centralizar solicitações comunitárias e tornar visível seu andamento.

### 4.2 Objetivos específicos

1. compreender o fluxo atual de recebimento e tratamento de solicitações da organização parceira;
2. identificar necessidades, atores, restrições e critérios de sucesso;
3. modelar os dados essenciais de uma solicitação;
4. implementar cadastro, consulta, edição, filtros e atualização de status;
5. disponibilizar indicadores simples extraídos do banco de dados;
6. verificar tecnicamente os fluxos críticos;
7. avaliar clareza, utilidade e facilidade de uso com participantes reais;
8. documentar decisões, resultados, limitações e próximos passos.

## 5. Público e atores

- **Morador ou participante:** registra uma necessidade e consulta o andamento.
- **Representante da organização:** organiza e atualiza as solicitações.
- **Equipe do PI:** pesquisa, desenvolve, testa e documenta a solução.
- **Orientador:** acompanha o método e as entregas acadêmicas.

Esses papéis são hipóteses iniciais e devem ser confirmados nas entrevistas.

## 6. Escopo do MVP

### Incluído

- formulário de nova solicitação;
- listagem, busca e filtros;
- visualização detalhada;
- edição e exclusão;
- prioridades e categorias;
- atualização de status;
- painel com indicadores;
- persistência em SQLite;
- interface responsiva.

### Fora do escopo inicial

- autenticação e perfis de permissão;
- envio de notificações;
- mapas e geolocalização automática;
- anexos e moderação de imagens;
- integração com órgãos públicos;
- publicação em produção.

## 7. Método de trabalho

O projeto combinará aprendizagem baseada em problemas, design centrado no ser humano e estudo de caso. A sequência proposta é:

1. **entender:** aproximação com a organização, observação do fluxo e entrevistas semiestruturadas;
2. **definir:** síntese do problema, requisitos, riscos e critérios de aceite;
3. **propor:** modelagem, protótipo e priorização do MVP;
4. **desenvolver:** implementação incremental com controle de versão;
5. **verificar:** testes técnicos e revisão de acessibilidade;
6. **validar:** tarefas de uso e questionário com participantes;
7. **analisar:** comparação dos resultados com objetivos e critérios;
8. **comunicar:** relatório final, demonstração e vídeo.

## 8. Cronograma de 80 horas

| Semana | Etapa | Atividades | Horas |
|---|---|---|---:|
| 1 | Análise do cenário | contato, observação, definição preliminar do problema | 8 |
| 2 | Plano de ação | tema, questão orientadora, objetivos, responsabilidades e riscos | 8 |
| 3 | Levantamento | entrevistas, pesquisa bibliográfica e requisitos | 10 |
| 4 | Estruturação | histórias, modelo de dados, protótipo e critérios de aceite | 10 |
| 5 | Proposta de solução | relatório parcial e implementação da base do sistema | 10 |
| 6 | Desenvolvimento | CRUD, filtros, indicadores e responsividade | 12 |
| 7 | Análise dos resultados | testes técnicos, sessões de uso e organização dos dados | 10 |
| 8 | Finalização | ajustes, relatório final, repositório e gravação do vídeo | 12 |
|  | **Total** |  | **80** |

## 9. Distribuição de responsabilidades

Preencher com responsáveis reais. Uma pessoa pode assumir mais de uma função, mas todos devem participar da pesquisa, desenvolvimento e apresentação.

| Frente | Responsável | Evidência esperada |
|---|---|---|
| contato com a comunidade | [PREENCHER] | registro de reunião e consentimento |
| pesquisa bibliográfica | [PREENCHER] | fichamentos e referências |
| requisitos e protótipo | [PREENCHER] | histórias, critérios e telas |
| backend e banco | [PREENCHER] | commits e testes |
| HTML/CSS e acessibilidade | [PREENCHER] | commits e checklist |
| testes e análise | [PREENCHER] | resultados consolidados |
| relatório e vídeo | [PREENCHER] | versão final e link |

## 10. Riscos e respostas

| Risco | Probabilidade | Impacto | Resposta |
|---|---|---|---|
| organização parceira indisponível | média | alto | contatar duas alternativas e limitar o recorte |
| escopo maior que o prazo | alta | alto | preservar o MVP e manter extras no backlog |
| poucos participantes na validação | média | médio | agendar com antecedência e registrar a limitação |
| exposição de dados pessoais | média | alto | usar dados fictícios no desenvolvimento e contato opcional |
| conflitos no Git | média | médio | branches curtas, commits pequenos e revisão antes da integração |
| falha na demonstração | baixa | alto | ensaio local, banco de demonstração e gravação de reserva |

## 11. Critérios de sucesso

- todos os fluxos críticos executados sem erro nos testes técnicos;
- usuário consegue registrar e localizar uma solicitação durante a sessão de validação;
- ao menos 80% das tarefas propostas são concluídas sem ajuda, caso a amostra permita esse cálculo;
- média mínima de 4 em 5 para clareza e facilidade de uso, tratada como meta, não como resultado antecipado;
- documentação descreve evidências, limitações e divergências sem fabricar dados.

## 12. Estratégia de controle de versão

- branch principal estável;
- branches curtas por funcionalidade ou documento;
- commits pequenos e descritivos, por exemplo `feat: adiciona filtro por status`;
- `.gitignore` protege dependências, banco local e arquivos de ambiente;
- integração somente após teste do fluxo alterado;
- tags sugeridas: `v0.1-prototipo`, `v0.2-validacao` e `v1.0-entrega`.

