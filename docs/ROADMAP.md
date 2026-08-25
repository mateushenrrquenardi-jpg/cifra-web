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

Status: **PENDENTE**

Objetivo:

Carregar um `.md` e apresentá-lo corretamente no navegador.

Critérios:

- metadados reconhecidos;
- acordes reconhecidos;
- posicionamento horizontal preservado;
- quebras de linha preservadas;
- linhas sem acordes preservadas.

## Fase 05 — Listagem e pesquisa

Status: **PENDENTE**

Objetivo:

Implementar:

- lista de músicas;
- lista de artistas;
- pesquisa por nome;
- pesquisa por artista.

## Fase 06 — Experiência de leitura

Status: **PENDENTE**

Objetivo:

Implementar:

- ajuste do tamanho da letra;
- tela cheia;
- ocultação automática da interface.

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
