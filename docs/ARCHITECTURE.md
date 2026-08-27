# Arquitetura — Cifra Web

## 1. Objetivo

Definir a arquitetura técnica da aplicação web de cifras sem introduzir decisões que não foram estabelecidas na Fase 00.

## 2. Visão geral

O sistema é uma aplicação web estática, acessada diretamente pelo navegador.

```text
                    ┌───────────────────────┐
                    │       Usuário         │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │       Navegador       │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Aplicação Web       │
                    │   HTML + CSS + JS     │
                    └───────────┬───────────┘
                                │
                   ┌────────────┴────────────┐
                   │                         │
                   ▼                         ▼
          GitHub Pages                Repositório de catálogo
                                      com arquivos .md
```

A separação física entre o repositório da aplicação e o repositório do catálogo é permitida e, para o projeto atual, será tratada como a organização preferencial porque desacopla código e conteúdo.

## 3. Tecnologias definidas

### Frontend

- HTML
- CSS
- JavaScript

### Hospedagem

- GitHub Pages

### Frameworks

Nenhum framework frontend faz parte do MVP.

### Backend

Nenhum backend tradicional faz parte do MVP.

### Banco de dados

Nenhum banco de dados remoto faz parte do MVP.

### Autenticação

Não haverá login no MVP.

## 4. Repositórios

### Repositório da aplicação

Responsável pelo código executável do site.

Estrutura inicial esperada:

```text
app-repository/
├── index.html
├── css/
├── js/
├── assets/
└── docs/ (opcional, caso a documentação seja mantida junto do app)
```

### Repositório do catálogo

Responsável pelos arquivos Markdown das músicas.

Estrutura esperada:

```text
catalog-repository/
└── musicas/
    ├── artista-normalizado/
    │   ├── musica-1.md
    │   └── musica-2.md
    └── outro-artista/
        └── musica.md
```

A localização exata dos repositórios e URLs públicas ainda será definida na implementação.

## 5. Fonte de verdade

A fonte oficial do catálogo é o repositório Git do catálogo.

O navegador não deve tratar dados de sessão como fonte oficial do conteúdo das cifras.

## 6. Fluxo do conteúdo

**Decisão tomada na Fase 05** (resolve o ponto em aberto que estava listado
na seção 17): a listagem de músicas e artistas usa um índice estático
(`index.json`), gerado a partir dos arquivos `.md` e mantido no repositório
do catálogo. Ver seção 6.1 para o porquê.

Fluxo para a **listagem** (tela inicial, busca):

```text
Arquivos .md em musicas/
   ↓
scripts/gerar-indice.js (repositório do catálogo)
   ↓
index.json (raiz do repositório do catálogo)
   ↓
Aplicação Web busca index.json via raw.githubusercontent.com
   ↓
Renderização das listas de músicas e artistas
```

Fluxo para **abrir uma cifra específica** (sob demanda, só quando o usuário clica):

```text
Usuário clica em uma música
   ↓
Aplicação Web busca aquele .md específico via raw.githubusercontent.com
   ↓
Parser do conteúdo da cifra
   ↓
Renderização HTML
```

### 6.1 Por que não usar a API do GitHub diretamente

A primeira implementação da Fase 05 chamava a API do GitHub
(`api.github.com/.../git/trees`) a cada carregamento de página para listar
os arquivos do catálogo. Essa API tem limite de **60 requisições por hora,
por IP, sem autenticação**. Na prática:

- Redes compartilhadas (escola, empresa, operadoras móveis com NAT) dividem
  esse limite entre todos os usuários atrás do mesmo IP, e ele esgota rápido.
- Qualquer outra chamada à API do GitHub feita por quem estiver na mesma
  rede (inclusive por outros sites/ferramentas) consome do mesmo limite.
- O resultado observado era a aplicação exibir erro de carregamento de forma
  intermitente e imprevisível — a causa mais provável de a Fase 05 ter
  "parado de funcionar" na prática, mesmo com a lógica de busca/filtro correta.

`raw.githubusercontent.com` (usado para servir `index.json` e os `.md`
individuais) é um CDN de conteúdo estático, não está sujeito a esse limite de
60/h, e responde de forma consistente.

### 6.2 Como o índice é mantido atualizado

Um workflow do GitHub Actions no repositório do catálogo
(`.github/workflows/gerar-indice.yml`) roda `scripts/gerar-indice.js`
automaticamente sempre que algo em `musicas/` é alterado no branch `main`, e
faz commit do `index.json` atualizado. Isso evita que o índice fique
desatualizado por esquecimento humano. O script também pode ser rodado
manualmente (`node scripts/gerar-indice.js`).

## 7. Arquivos de cifra

Cada música é representada por um arquivo `.md` contendo:

1. Frontmatter YAML com metadados.
2. Corpo Markdown.
3. Convenção de acordes entre colchetes.

Exemplo:

```markdown
---
title: Tempo Perdido
artist: Legião Urbana
category: Rock
tags:
  - nacional
author: Renato Russo
created_at: 2026-08-23
original_key: C
---

[C]             [Am]
Todos os dias quando acordo

[Em]                 [F]
Não tenho mais o tempo que passou
```

## 8. Regra de acordes

`[]` é reservado exclusivamente para acordes.

Qualquer conteúdo entre colchetes será interpretado pelo aplicativo como acorde.

Exemplos aceitos pela regra de sintaxe:

```text
[C]
[Am7]
[Cmaj7]
[F#m7]
[G/B]
[C7(9)]
```

Texto entre colchetes que não represente um acorde válido para a futura lógica musical deverá ser considerado erro de conteúdo. A definição formal de validação de acordes ficará para a implementação do parser/transpositor.

## 9. Posicionamento dos acordes

O posicionamento horizontal definido no `.md` é significativo e deve ser preservado.

O sistema não deve inferir semanticamente qual palavra recebe determinado acorde.

A alteração de espaços no arquivo pode alterar a posição visual do acorde.

## 10. Quebras de linha

As quebras de linha do arquivo fazem parte da apresentação e devem ser preservadas na visualização.

Linhas sem acordes continuam sendo texto normal.

## 11. Tom original

`original_key` é obrigatório.

O valor representa o tom em que a cifra foi cadastrada.

O valor não será alterado quando a futura funcionalidade de transposição for implementada.

Exemplo:

```text
original_key = C
exibição atual = D
```

## 12. Funcionalidades do MVP

- pesquisa por nome;
- pesquisa por artista;
- lista de músicas;
- lista de artistas;
- visualização da cifra;
- ajuste do tamanho da letra;
- tela cheia;
- ocultação automática da interface durante a leitura.

## 13. Funcionalidades fora do MVP

- transposição;
- escolha direta de tom;
- favoritos;
- categorias como recurso navegável/filtro;
- repertórios;
- rolagem automática;
- personalização avançada de acordes;
- modo claro/escuro;
- cache offline;
- sincronização avançada;
- interface administrativa;
- contas/login;
- aplicativo nativo;
- PWA.

## 14. Interface administrativa futura

Está prevista uma interface web simples para pessoas autorizadas enviarem um `.md` e informarem seus metadados.

Ela não terá editor de cifra.

Fluxo previsto:

```text
Selecionar .md
      ↓
Informar metadados
      ↓
Validar
      ↓
Enviar
      ↓
Atualizar catálogo
```

Esse recurso não faz parte do MVP.

## 15. Offline e sincronização

Não fazem parte do MVP.

A arquitetura futura poderá incorporar armazenamento local no navegador e sincronização incremental, mas nenhuma tecnologia específica de cache local é considerada decisão atual.

## 16. Princípios de manutenção

- Priorizar código simples e legível.
- Evitar abstrações prematuras.
- Evitar dependências desnecessárias.
- Não introduzir framework sem decisão explícita.
- Não criar backend para resolver uma necessidade que o GitHub já atende.
- Não implementar funcionalidades futuras antecipadamente.
- Manter o parser e o renderer separados logicamente.

## 17. Decisões ainda abertas

Estas decisões serão tomadas durante a implementação, quando houver necessidade real:

- ~~mecanismo exato de busca~~ — **resolvido na Fase 05**: filtro em memória (client-side) sobre o índice carregado, por título/artista/categoria. Ver `js/app.js`.
- ~~geração de índice de catálogo~~ — **resolvido na Fase 05**, ver seções 6.1 e 6.2.
- ~~formato do índice~~ — **resolvido na Fase 05**: `index.json`, documentado em `DATA_MODEL.md`.
- ~~mecanismo de acesso aos arquivos remotos~~ — **resolvido na Fase 05**: `raw.githubusercontent.com`, ver seção 6.1.
- estratégia de parser Markdown;
- implementação da validação de acordes;
- estrutura de módulos JavaScript;
- estratégia futura de cache;
- estratégia futura de sincronização;
- detalhes da interface administrativa;
- mecanismo futuro de favoritos.
