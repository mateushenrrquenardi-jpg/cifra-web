# Contexto Permanente para IA — Cifra Web

## 1. Identidade do projeto

Você está trabalhando no projeto **Cifra Web**, uma aplicação web minimalista para visualização e, futuramente, transposição de cifras musicais.

## 2. Objetivo atual

Construir primeiro um MVP funcional e simples.

O MVP deve:

- pesquisar músicas por nome;
- pesquisar músicas por artista;
- listar músicas;
- listar artistas;
- visualizar cifras;
- permitir ajustar o tamanho da letra;
- permitir tela cheia;
- esconder a interface automaticamente durante a leitura.

## 3. Tecnologias obrigatórias

Utilize somente:

- HTML;
- CSS;
- JavaScript.

Não introduza framework frontend sem autorização explícita.

## 4. Hospedagem

A aplicação será hospedada no GitHub Pages.

Não existe domínio próprio inicialmente.

## 5. Backend e banco

O MVP não possui backend tradicional nem banco de dados remoto.

Não introduza Firebase, Supabase, PostgreSQL, MongoDB, API própria ou solução equivalente apenas para executar uma tarefa do MVP.

## 6. Catálogo

As cifras são arquivos Markdown mantidos no GitHub.

Cada música tem Frontmatter YAML seguido pelo corpo da cifra.

Campos definidos:

```yaml
---
title: Nome da música
artist: Artista oficial
category: Categoria
tags:
  - tag
author: Autor/compositor opcional
created_at: YYYY-MM-DD
original_key: C
---
```

`capo`/capotraste não existe no modelo.

## 7. Regra fundamental de acordes

Tudo entre `[` e `]` é considerado acorde.

Exemplo:

```text
[C]             [Am]
Todos os dias quando acordo
```

`[]` é exclusivamente sintaxe de acorde.

Não use colchetes para `Verso`, `Refrão`, observações ou outros conteúdos.

## 8. Formatação

Os espaços do arquivo são significativos.

Não reposicione acordes por inferência sem uma tarefa específica pedindo isso.

As quebras de linha também são significativas e devem ser preservadas.

## 9. Tom original

`original_key` é obrigatório e representa o tom no qual a cifra foi cadastrada.

Se houver transposição futuramente, ela não deverá alterar o valor original.

## 10. O que não fazer

Não:

- transformar o projeto em React/Vue/etc.;
- criar backend sem necessidade;
- criar login no MVP;
- implementar funcionalidades futuras automaticamente;
- alterar o formato da cifra sem atualizar `DATA_MODEL.md`;
- inventar campos de metadados;
- criar uma taxonomia sofisticada de categorias sem requisito;
- adicionar capotraste;
- implementar PWA;
- criar APK/IPA;
- otimizar para dezenas de milhares de músicas antes de existir essa necessidade.

## 11. Como trabalhar

Antes de editar:

1. Ler `README.md`.
2. Ler `docs/ARCHITECTURE.md`.
3. Ler `docs/DATA_MODEL.md`.
4. Ler `docs/ROADMAP.md`.
5. Ler este arquivo.
6. Identificar o menor conjunto de arquivos necessário para a tarefa.

Durante a implementação:

- alterar apenas o necessário;
- evitar refatoração não relacionada;
- manter o código legível;
- testar a tarefa antes de declarar conclusão.

Depois da implementação:

- descrever os arquivos alterados;
- informar o que foi implementado;
- informar qualquer pendência;
- atualizar documentação se alguma decisão foi alterada.

## 12. Prioridade

Em caso de dúvida, respeite esta ordem:

1. requisitos definidos pelo projeto;
2. `DATA_MODEL.md`;
3. `ARCHITECTURE.md`;
4. `ROADMAP.md`;
5. menor complexidade necessária.

Se uma tarefa não puder ser feita sem tomar uma decisão arquitetural nova, não invente a decisão. Identifique claramente o ponto em aberto.
