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

Fluxo desejado para o MVP:

```text
Arquivo .md
   ↓
Repositório do catálogo
   ↓
Aplicação Web
   ↓
Leitura do arquivo
   ↓
Parser do conteúdo da cifra
   ↓
Renderização HTML
```

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

- mecanismo exato de busca;
- geração de índice de catálogo;
- formato do índice;
- mecanismo de acesso aos arquivos remotos;
- estratégia de parser Markdown;
- implementação da validação de acordes;
- estrutura de módulos JavaScript;
- estratégia futura de cache;
- estratégia futura de sincronização;
- detalhes da interface administrativa;
- mecanismo futuro de favoritos.
