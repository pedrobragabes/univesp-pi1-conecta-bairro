# Relatório parcial

## Conecta Bairro: sistema web para registro e acompanhamento de solicitações comunitárias

**Disciplina:** PJI110 / PIE I — confirmar oferta e matriz no Portal/AVA

**Integrantes e RAs:** [PREENCHER]  
**Polo e município:** [PREENCHER]  
**Orientador(a):** [PREENCHER]  
**Organização parceira:** [PREENCHER]

## Resumo

Este relatório apresenta a análise inicial e a proposta do Conecta Bairro, um sistema web destinado a centralizar solicitações de uma comunidade local. O problema de partida é a possível dispersão de demandas em mensagens, conversas e registros não compartilhados, o que dificulta consulta, priorização e acompanhamento. A proposta foi estruturada como um produto mínimo viável com cadastro, listagem, busca, filtros, atualização de status e indicadores. O desenvolvimento utiliza Express, HTML renderizado com EJS, CSS e SQLite, com histórico mantido em Git. O levantamento com uma organização parceira ainda deverá confirmar o recorte e revisar os requisitos; por isso, este relatório distingue hipóteses de evidências já produzidas.

**Palavras-chave:** desenvolvimento web; requisitos; comunidade; banco de dados; projeto integrador.

## 1. Introdução

Projetos de computação tornam-se mais significativos quando partem de situações observáveis e são construídos em contato com as pessoas afetadas. A aprendizagem baseada em problemas favorece a mobilização de conhecimentos para investigar e propor soluções, enquanto abordagens centradas no ser humano orientam a compreensão de necessidades antes da definição da interface (CASALE, 2013; CAVALCANTI, 2015).

O projeto investiga como uma aplicação web simples pode apoiar o registro e o acompanhamento de solicitações de uma comunidade. Além de responder a um problema concreto, o trabalho permite integrar conteúdos de resolução de problemas, levantamento de requisitos, framework web, HTML, CSS, banco de dados e controle de versão.

## 2. Análise do cenário

O cenário inicial considera associações, centros comunitários ou pequenos coletivos que recebem solicitações por múltiplos canais. Quando não há um registro compartilhado, a consulta depende da memória ou do acesso a conversas privadas. Isso pode produzir retrabalho, pouca transparência e dificuldade de priorização.

Essa descrição é uma hipótese fundamentada na proposta e não um resultado empírico. Para validá-la, a equipe deverá identificar uma organização parceira, obter concordância para a pesquisa e realizar entrevistas semiestruturadas sobre o fluxo atual, os responsáveis, as informações mínimas e os pontos de dificuldade.

## 3. Problema e questão de pesquisa

**Problema:** solicitações comunitárias podem ficar dispersas e sem acompanhamento comum.

**Questão:** como uma aplicação web simples pode apoiar o registro, a organização e o acompanhamento transparente de solicitações de uma comunidade local?

## 4. Objetivos

O objetivo geral é desenvolver e avaliar um protótipo web para centralizar solicitações comunitárias. Como objetivos específicos, pretende-se compreender o fluxo atual, levantar requisitos, modelar os dados, implementar o ciclo de cadastro e acompanhamento, verificar o sistema e avaliar sua utilidade e facilidade de uso.

## 5. Fundamentação e método

Casale (2013) sustenta a aprendizagem baseada em problemas como caminho para desenvolver competências em engenharia. Cavalcanti (2015) discute contribuições do design thinking para interfaces centradas no ser humano. Gerhardt e Silveira (2009) oferecem fundamentos para organização da pesquisa, enquanto Yin (2015) orienta o planejamento de estudos de caso. Esses referenciais apoiam um percurso iterativo: compreender, definir, propor, desenvolver, testar e analisar.

A pesquisa terá caráter aplicado, abordagem predominantemente qualitativa e estratégia de estudo de caso. Os procedimentos planejados são entrevista semiestruturada, análise do fluxo, construção incremental do protótipo, teste de tarefas e questionário curto. Os participantes deverão receber explicação sobre objetivo, voluntariedade e tratamento dos dados.

## 6. Requisitos iniciais

Os requisitos essenciais são cadastrar, listar, visualizar, editar e atualizar o status de solicitações; validar os campos; e persistir os dados. Busca, filtros, exclusão e indicadores complementam o MVP. A interface deve ser responsiva, navegável por teclado e adequada à execução local. Os requisitos completos e seus critérios de aceite constam em `02-requisitos-e-modelagem.md`.

## 7. Proposta de solução

O Conecta Bairro apresenta um mural comunitário. Um participante registra título, descrição, categoria, prioridade, localização, nome e contato opcional. O representante consulta os registros e muda seu status. O painel resume solicitações abertas, em andamento e concluídas.

A arquitetura emprega Express como framework web, EJS para produzir HTML semântico, CSS próprio para identidade e responsividade e SQLite para persistência. O controle de versão preserva a evolução do código e dos documentos. A opção por renderização no servidor reduz a complexidade do MVP e mantém o foco nos objetivos do PI I.

## 8. Situação do desenvolvimento

Na versão parcial, já foram implementados o esquema do banco, o CRUD, os filtros, a busca, os indicadores, a validação no servidor, o tratamento de páginas inexistentes e a interface responsiva. A suíte automatizada cobre painel vazio, fluxo de criação até exclusão e rejeição de dados inválidos.

### Verificação técnica de 04/10/2026 — versão 1.0.2

| Requisitos relacionados | Evidência executada | Resultado e limite |
|---|---|---|
| RF01–RF04, RF06–RF10 | Testes HTTP e fluxo de navegador: cadastro, texto escapado, edição, status, busca/filtros e indicadores | Onze testes Node e oito E2E aprovados no total; dados sintéticos |
| RF05 | Página HTML de confirmação, Cancelar e envio explícito; rejeição de POST sem confirmação | Exclusão não ocorre no GET ou cancelamento; disponível sem JavaScript. Ainda não existe autorização |
| RNF01–RNF03 | Seis páginas em 1440, 390 e 320 px; análise Axe, foco do atalho, menu com Escape e navegação sem JavaScript | Vinte e duas análises sem violações nos estados testados, sem overflow; não substitui leitores de tela e participantes |
| RNF04–RNF06 | SQL parametrizado e fixture SQLite em arquivo fechado/reaberto | Edição e status preservados no arquivo temporário; não é restauração de backup nem ensaio de produção |
| RNF07 | npm ci, npm run check, npm test, instalação do Chromium, npm run test:e2e e npm audit | Reprodução local e CI; servidor de navegador em loopback com banco separado |
| Política de conteúdo e dependências | Sem erros CSP nas seis páginas testadas; audit completo | Zero alertas conhecidos nesta execução; sem relaxar a política para estilos inline |

Foram corrigidos corpo ausente e JSON malformado/excessivo, confirmação dependente de JavaScript, navegação móvel sem fallback, estilos de indicadores recusados pela CSP, contraste e foco. Os testes novos de backend e três cenários de navegador falharam antes das correções. Logs e imagens de CI devem ser vinculados ao commit efetivamente usado na entrega.

Não houve levantamento com comunidade, aceites, dados pessoais reais, publicação pública ou envio ao AVA. As issues 3, 5 e 6 continuam abertas para validação/entrega final, confirmação de matriz/equipe/parceiro e levantamento real. O relatório final e seu DOCX existentes não foram regenerados como se essas etapas estivessem concluídas.

Permanecem pendentes a confirmação dos requisitos com uma organização real, as sessões de validação, os ajustes decorrentes e a consolidação dos resultados no relatório final.

## 9. Próximas etapas

1. confirmar organização e participantes;
2. aplicar entrevista e revisar requisitos;
3. executar roteiro de tarefas com o protótipo;
4. registrar resultados sem dados pessoais desnecessários;
5. priorizar e implementar correções;
6. repetir os testes;
7. finalizar relatório e vídeo.

## Referências

CASALE, A. *Aprendizagem baseada em problemas: desenvolvimento de competências para o ensino em engenharia*. 2013. Tese (Doutorado em Engenharia de Produção) — Escola de Engenharia de São Carlos, Universidade de São Paulo, São Carlos, 2013.

CAVALCANTI, C. M. C. *Contribuições do design thinking para concepção de interfaces de ambientes virtuais de aprendizagem centradas no ser humano*. 2015. Tese (Doutorado em Educação) — Faculdade de Educação, Universidade de São Paulo, São Paulo, 2015.

GERHARDT, T. E.; SILVEIRA, D. T. (org.). *Métodos de pesquisa*. Porto Alegre: Editora da UFRGS, 2009.

YIN, R. K. *Estudo de caso: planejamento e métodos*. Porto Alegre: Bookman, 2015.

