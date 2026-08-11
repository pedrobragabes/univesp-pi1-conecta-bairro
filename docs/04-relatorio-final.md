# Relatório final

## Conecta Bairro: sistema web para registro e acompanhamento de solicitações comunitárias

**Disciplina:** PJI110 — Projeto Integrador em Computação I  
**Curso:** Eixo de Computação — UNIVESP  
**Integrantes e RAs:** [PREENCHER]  
**Polo:** [PREENCHER]  
**Orientador(a):** [PREENCHER]  
**Município e ano:** [PREENCHER]

## Resumo

Este trabalho apresenta o desenvolvimento do Conecta Bairro, um protótipo de aplicação web para registrar, organizar e acompanhar solicitações comunitárias. O projeto parte da hipótese de que demandas recebidas por canais informais podem ficar dispersas, dificultando consulta, priorização e acompanhamento. Foi adotado um percurso aplicado e iterativo, articulando aprendizagem baseada em problemas, levantamento de requisitos, prototipação, desenvolvimento e avaliação. O MVP foi construído com Express, templates EJS, HTML, CSS e banco SQLite, sob controle de versão Git. A solução implementa cadastro, consulta, edição, exclusão, busca, filtros, atualização de status e indicadores. Os testes automatizados verificaram os fluxos técnicos definidos. A validação com usuários e seus resultados devem ser preenchidos com os dados reais coletados pela equipe antes da entrega. Conclui-se tecnicamente que o protótipo atende ao escopo funcional proposto e constitui uma base adequada para avaliação no contexto parceiro, embora autenticação, governança de dados e implantação permaneçam fora do MVP.

**Palavras-chave:** aplicação web; levantamento de requisitos; comunidade; SQLite; Express.

## 1. Introdução

A computação pode apoiar organizações locais quando transforma informações dispersas em registros acessíveis e acompanháveis. Contudo, uma solução útil não decorre apenas da implementação: é necessário compreender o contexto, delimitar o problema, levantar requisitos e avaliar o produto com os possíveis usuários.

O Conecta Bairro foi concebido para o Projeto Integrador em Computação I como resposta à seguinte questão: **como uma aplicação web simples pode apoiar o registro, a organização e o acompanhamento transparente de solicitações de uma comunidade local?** O trabalho integra os conteúdos previstos na disciplina por meio de um software funcional, de sua modelagem e da documentação do processo.

## 2. Contexto e problema

O cenário investigado é o de [PREENCHER: organização/comunidade], localizada em [PREENCHER]. Antes do sistema, as solicitações eram recebidas por [PREENCHER com dados da entrevista]. Segundo os participantes, as principais dificuldades eram [PREENCHER sem identificar pessoas].

> **Orientação de integridade acadêmica:** se a aproximação ainda não ocorreu, mantenha o texto como “cenário proposto” e não afirme que esses dados foram observados. Substitua este aviso somente após registrar evidências reais.

A análise inicial indicou como hipótese que o uso de canais não centralizados pode reduzir a visibilidade do histórico e do andamento. O escopo foi limitado a um mural de solicitações, evitando integrações e automações incompatíveis com o tempo da disciplina.

## 3. Objetivos

### 3.1 Objetivo geral

Desenvolver e avaliar um protótipo web capaz de centralizar solicitações comunitárias e tornar visível seu andamento.

### 3.2 Objetivos específicos

1. compreender o fluxo de recebimento e tratamento das solicitações;
2. levantar e priorizar requisitos;
3. modelar e persistir as informações essenciais;
4. implementar o ciclo de cadastro e acompanhamento;
5. apresentar indicadores extraídos do banco;
6. verificar os fluxos críticos com testes;
7. avaliar o protótipo com participantes do contexto;
8. analisar limitações e oportunidades de evolução.

## 4. Fundamentação teórica

A aprendizagem baseada em problemas coloca o estudante diante de situações que exigem investigação, integração de conhecimentos e construção de respostas, favorecendo o desenvolvimento de competências (CASALE, 2013). No projeto, essa perspectiva aparece na passagem do problema comunitário para requisitos, protótipo e testes.

O design thinking contribui para a concepção de interfaces centradas no ser humano ao valorizar compreensão do usuário, prototipação e iteração (CAVALCANTI, 2015). Assim, os requisitos do Conecta Bairro são tratados como hipóteses revisáveis em contato com a comunidade, não como decisões exclusivamente técnicas.

Gerhardt e Silveira (2009) destacam a necessidade de coerência entre problema, objetivos, procedimentos e análise. Yin (2015) fornece referências para organizar o estudo de caso e preservar a relação entre contexto e evidências. Esses fundamentos orientam o registro dos procedimentos, a distinção entre resultado técnico e percepção de usuário e a exposição das limitações.

## 5. Metodologia

Trata-se de um projeto aplicado, com abordagem predominantemente qualitativa e estratégia de estudo de caso. O desenvolvimento ocorreu de forma incremental. As etapas foram:

1. análise preliminar do cenário e formulação da questão;
2. pesquisa bibliográfica;
3. levantamento de requisitos por [PREENCHER: entrevista, observação ou oficina];
4. modelagem dos dados e dos fluxos;
5. implementação do MVP;
6. testes técnicos automatizados e manuais;
7. validação por tarefas e questionário;
8. análise e ajustes.

### 5.1 Participantes e ética

Participaram [PREENCHER: quantidade e relação com o contexto, sem nomes]. Todos receberam explicação sobre objetivo, participação voluntária e tratamento dos dados. [PREENCHER: como foi obtido o consentimento]. Não foram coletados dados pessoais além do necessário para [PREENCHER].

### 5.2 Instrumentos

Foram previstos uma entrevista semiestruturada, um roteiro de tarefas no protótipo e um questionário de percepção em escala de 1 a 5. O instrumento completo encontra-se no documento `06-questionario-validacao.md`.

## 6. Levantamento de requisitos

O levantamento produziu [PREENCHER: quantidade] necessidades. Os requisitos essenciais confirmados foram [PREENCHER após a entrevista]. No MVP técnico, foram implementados cadastro, listagem, detalhes, edição, exclusão, atualização de status, busca, filtros, indicadores e validação.

As principais regras são limites de tamanho nos textos, valores controlados para categoria, prioridade e status, contato opcional e registro das datas de criação e atualização. Os requisitos e critérios de aceite estão detalhados em `02-requisitos-e-modelagem.md`.

## 7. Desenvolvimento da solução

### 7.1 Arquitetura

O navegador envia requisições HTTP ao Express. O framework valida a entrada, executa consultas parametrizadas no SQLite e renderiza templates EJS em HTML. O CSS define a apresentação responsiva, e um pequeno script controla o menu e a confirmação de exclusão. Essa arquitetura em camadas simplifica a execução local e mantém separadas interface, regras de aplicação e persistência.

### 7.2 Banco de dados

A tabela `solicitacoes` armazena identificador, título, descrição, categoria, prioridade, localização, solicitante, contato, status e datas. Restrições `CHECK` reforçam as regras no próprio banco. O arquivo de dados é ignorado pelo Git para evitar versionar informações locais.

### 7.3 Interface

A interface adota a metáfora de um mural cívico, com alto contraste, hierarquia tipográfica e componentes que comunicam categoria, prioridade e status. O HTML informa o idioma, contém link para pular ao conteúdo, usa títulos hierárquicos e fornece foco visível. O layout se adapta a telas menores e respeita a preferência por movimento reduzido.

### 7.4 Controle de versão

O código e a documentação foram mantidos em Git. [PREENCHER: endereço do repositório, branches/tags utilizadas e breve síntese da participação dos integrantes]. Dependências, banco local e arquivos de ambiente foram excluídos por `.gitignore`.

## 8. Resultados

### 8.1 Resultados técnicos verificados

Em 11 de agosto de 2026, foram executados três testes automatizados, todos aprovados:

| Teste | Resultado |
|---|---|
| painel e API com banco vazio | aprovado |
| fluxo de criar, consultar, mudar status e excluir | aprovado |
| rejeição de formulário inválido | aprovado |

Também foi executada a verificação sintática dos arquivos JavaScript principais. O gerenciador de pacotes reportou zero vulnerabilidades conhecidas nas dependências instaladas naquele momento. Esses resultados confirmam o comportamento técnico coberto pelos testes, mas não substituem avaliação de utilidade, acessibilidade com tecnologias assistivas nem auditoria de segurança para produção.

### 8.2 Resultados com usuários

Preencher esta seção somente depois da aplicação do instrumento.

| Indicador | Resultado real | Interpretação |
|---|---:|---|
| participantes | [PREENCHER] | [PREENCHER] |
| tarefas concluídas sem ajuda | [PREENCHER] | [PREENCHER] |
| média de facilidade de uso (1–5) | [PREENCHER] | [PREENCHER] |
| média de clareza dos status (1–5) | [PREENCHER] | [PREENCHER] |
| média de utilidade percebida (1–5) | [PREENCHER] | [PREENCHER] |

Os principais comentários foram [PREENCHER]. A equipe priorizou [PREENCHER: ajustes] porque [PREENCHER: evidência].

## 9. Análise e discussão

Os resultados técnicos mostram que o MVP implementa o ciclo funcional proposto e preserva consistência nos casos testados. A combinação de validação na aplicação e restrições no banco reduz entradas incompatíveis com as regras. Busca e filtros respondem ao objetivo de localizar demandas, enquanto os status e indicadores apoiam o acompanhamento.

A análise de adequação ao contexto depende dos dados reais dos participantes. Após o preenchimento da seção 8.2, a equipe deverá comparar cada resultado com os critérios do plano de ação, discutir divergências e evitar generalizações, especialmente se a amostra for pequena.

## 10. Limitações

- requisitos ainda dependem da confirmação com a organização parceira;
- amostra de validação [PREENCHER: caracterizar];
- MVP não possui autenticação nem autorização;
- exclusão é definitiva e não há trilha de auditoria;
- contato fica armazenado localmente sem mecanismo próprio de consentimento;
- não foram realizados teste de carga, pentest ou auditoria completa de acessibilidade;
- indicadores descrevem quantidade, não impacto ou qualidade do atendimento.

## 11. Conclusão

O Conecta Bairro materializa os objetivos técnicos da disciplina ao reunir framework web, HTML, CSS, banco de dados, requisitos e controle de versão em uma solução executável. O protótipo centraliza registros e explicita seu andamento por meio de um fluxo simples e indicadores.

Do ponto de vista técnico, o MVP atende aos requisitos implementados e passou nos testes automatizados definidos. A conclusão sobre sua utilidade para a comunidade deve ser complementada pelos resultados reais da validação. Como continuidade, recomendam-se autenticação, perfis de acesso, histórico de alterações, política de privacidade, notificações e implantação piloto sob responsabilidade de uma organização definida.

## Referências

CASALE, A. *Aprendizagem baseada em problemas: desenvolvimento de competências para o ensino em engenharia*. 2013. Tese (Doutorado em Engenharia de Produção) — Escola de Engenharia de São Carlos, Universidade de São Paulo, São Carlos, 2013.

CAVALCANTI, C. M. C. *Contribuições do design thinking para concepção de interfaces de ambientes virtuais de aprendizagem centradas no ser humano*. 2015. Tese (Doutorado em Educação) — Faculdade de Educação, Universidade de São Paulo, São Paulo, 2015.

GERHARDT, T. E.; SILVEIRA, D. T. (org.). *Métodos de pesquisa*. Porto Alegre: Editora da UFRGS, 2009.

YIN, R. K. *Estudo de caso: planejamento e métodos*. Porto Alegre: Bookman, 2015.

## Apêndices sugeridos

- Apêndice A — roteiro de entrevista;
- Apêndice B — instrumento de validação;
- Apêndice C — requisitos e critérios de aceite;
- Apêndice D — capturas das telas;
- Apêndice E — evidências dos testes e do histórico Git.

