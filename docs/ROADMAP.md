# Roadmap — Cifra Web

## Visão geral

O desenvolvimento será dividido em fases pequenas para permitir que diferentes ferramentas e agentes de IA trabalhem no projeto em dias diferentes sem perder contexto.

## Fase 00 — Especificação

Status: **CONCLUÍDA**

Entregas:

- objetivo do produto;
- público inicial;
- escopo do MVP;
- arquitetura conceitual;
- formato das cifras;
- regras de conteúdo;
- visão de funcionalidades futuras.

## Fase 01 — Documentação operacional

Status: **CONCLUÍDA**

Entregas:

- `README.md`;
- `ARCHITECTURE.md`;
- `DATA_MODEL.md`;
- `ROADMAP.md`;
- `AI_CONTEXT.md`;
- `AI_DEVELOPMENT.md`.

Critério de conclusão:

> Uma nova IA deve conseguir entender o objetivo, o escopo e as regras fundamentais do projeto lendo o repositório sem depender da conversa original.

## Fase 02 — Estrutura inicial do projeto

Status: **CONCLUÍDA**

Objetivo:

Criar o esqueleto da aplicação web em HTML/CSS/JS e comprovar que ele pode ser publicado no GitHub Pages.

Critérios de aceitação:

- aplicação abre no navegador;
- estrutura de pastas definida;
- CSS carregado;
- JavaScript carregado;
- GitHub Pages exibindo a aplicação;
- nenhum framework frontend.

## Fase 03 — Importador de Cifras e Primeiro Catálogo

Status: **CONCLUÍDA**

Objetivo:

Criar poucas cifras reais seguindo `DATA_MODEL.md`.

Critérios:

- arquivos `.md` válidos;
- Frontmatter válido;
- artista padronizado;
- tom original informado;
- conteúdo com acordes entre `[]`.

## Fase 04 — Leitura de cifras

Status: **CONCLUÍDA** ✅

Objetivo:

Carregar um `.md` e apresentá-lo corretamente no navegador.

Critérios atendidos:

- ✅ metadados reconhecidos — Frontmatter parseado corretamente (title, artist, category, tags, author, created_at, original_key);
- ✅ acordes reconhecidos — Suporta acordes simples, com baixo e extensões complexas (15 acordes na cifra exemplo);
- ✅ posicionamento horizontal preservado — Espaçamento relativo mantido entre acordes;
- ✅ quebras de linha preservadas — Estrutura de linhas mantida intacta do arquivo original;
- ✅ linhas sem acordes preservadas — Letras e texto renderizado sem alterações.

Relatório completo: `FASE04_RELATORIO.md`

## Fase 05 — Listagem e pesquisa

Status: **CONCLUÍDA** ✅

Objetivo:

Implementar:

- ✅ lista de músicas — Ordenadas alfabeticamente com título, artista e tom;
- ✅ lista de artistas — Com contagem de músicas;
- ✅ pesquisa por nome — Filtro em tempo real;
- ✅ pesquisa por artista — Filtro em tempo real.

Critério bônus atendido:
- ✅ pesquisa por categoria — Filtro funcionando.

Nota importante: A Fase 05 estava 95% implementada desde a Fase 04 em app.js. Esta fase consistiu em validação e documentação.

Relatório completo: `docs/FASE05_RELATORIO.md`

## Fase 06 — Experiência de leitura

Status: **CONCLUÍDA**

Objetivo:

Implementar:

- ✅ ajuste do tamanho da letra — Botões A-, A+ com incremento 0.1rem (0.6 a 2.5rem)
- ✅ tela cheia — Botão ⛶ com API Fullscreen moderna
- ✅ ocultação automática da interface — Oculta header após 3seg em fullscreen, reativa com mouse/teclado

Critérios de aceitação atendidos: **10/10 ✅**

Relatório completo: `docs/FASE06_RELATORIO.md`

Arquivos modificados:
- `js/app.js` — Adicionadas funções showUI/hideUI e listeners
- `css/style.css` — Adicionada classe .hidden-ui com transição suave

## Fase 07 — Qualidade e revisão

Status: **PENDENTE**

Objetivo:

- testes manuais;
- revisão de código;
- revisão de comportamento responsivo;
- revisão com uma segunda IA, se possível;
- correção de bugs encontrados.

## Fase 08 — Funcionalidades posteriores

Status: **FUTURA**

Possíveis entregas:

- transposição;
- escolha direta de tom;
- favoritos;
- categorias navegáveis;
- repertórios;
- rolagem automática;
- tamanho dos acordes;
- cor dos acordes;
- modo claro/escuro;
- personalização avançada.

## Fase 09 — Catálogo e administração

Status: **FUTURA**

Possíveis entregas:

- geração automática de índice;
- validação automatizada;
- publicação automatizada;
- interface web de upload;
- usuários administrativos autorizados.

## Fase 10 — Offline e sincronização

Status: **FUTURA**

Possíveis entregas:

- armazenamento local no navegador;
- cache de cifras acessadas;
- atualização incremental;
- sincronização em segundo plano.

## Regra do roadmap

Uma fase futura não deve ser implementada antecipadamente apenas porque foi planejada.

Cada fase só começa quando a anterior estiver funcional ou quando houver uma razão explícita para alterar a ordem.
