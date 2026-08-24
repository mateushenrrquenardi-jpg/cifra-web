# Modelo de Dados — Cifra Web

## 1. Objetivo

Definir o formato oficial do arquivo Markdown de uma música.

## 2. Unidade de conteúdo

Cada música será representada por um arquivo `.md`.

Padrão de caminho:

```text
musicas/<artista-normalizado>/<musica-normalizada>.md
```

Exemplo:

```text
musicas/legiao-urbana/tempo-perdido.md
```

## 3. Frontmatter

O arquivo começa com YAML Frontmatter.

Modelo-base:

```yaml
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
```

## 4. Campos

| Campo | Obrigatório | Regra |
|---|---|---|
| `title` | Sim | Nome da música |
| `artist` | Sim | Nome oficial e padronizado do artista |
| `category` | Sim | Uma categoria geral |
| `tags` | Definido como conceito | Lista de tags separada da categoria |
| `author` | Não | Autor/compositor quando conhecido |
| `created_at` | Sim | Data informada manualmente no `.md` |
| `original_key` | Sim | Tom original da cifra |

### 4.1 `title`

Nome da música.

Não pode estar ausente ou vazio.

### 4.2 `artist`

Nome oficial do artista.

O mesmo artista deve utilizar uma única grafia oficial no catálogo.

### 4.3 `category`

Uma categoria geral por música.

Exemplo:

```yaml
category: Rock
```

### 4.4 `tags`

Tags são distintas da categoria.

Exemplo:

```yaml
tags:
  - nacional
  - anos-80
```

O catálogo inicial será pequeno e não terá uma taxonomia rígida de tags.

A definição de obrigatoriedade de pelo menos uma tag ainda não foi estabelecida; o formato deve aceitar uma lista vazia quando necessário.

### 4.5 `author`

Autor/compositor da música.

Campo opcional.

Quando não houver informação, o campo pode ser omitido.

### 4.6 `created_at`

Data de inclusão no catálogo.

A data será informada manualmente no arquivo.

Formato recomendado:

```text
YYYY-MM-DD
```

### 4.7 `original_key`

Tom original da cifra.

Campo obrigatório.

Exemplo:

```yaml
original_key: C
```

## 5. Capotraste

Não existe campo de capotraste no modelo.

## 6. Identificador interno

Não foi definido um ID independente para cada música.

O identificador interno do sistema fica **A DEFINIR**.

Não criar um ID arbitrário apenas para preencher a estrutura; a necessidade deverá surgir de um requisito real.

## 7. Corpo da cifra

Após o Frontmatter vem o corpo da música.

Os acordes são representados entre colchetes.

Exemplo:

```markdown
[C]             [Am]
Todos os dias quando acordo

[Em]                 [F]
Não tenho mais o tempo que passou
```

## 8. Sintaxe dos acordes

Regra definida:

```text
[ACORDE]
```

O conteúdo entre colchetes é tratado como acorde.

A estrutura de acorde pode conter extensões e baixo, por exemplo:

```text
[C]
[Am7]
[Cmaj7]
[F#m7]
[G/B]
[C7(9)]
```

## 9. Uso dos colchetes

Os colchetes não serão utilizados para títulos de seção, observações ou texto comum.

Exemplo não permitido:

```text
[Refrão]
```

## 10. Posicionamento

Os espaços presentes no arquivo são significativos para o posicionamento visual dos acordes.

Não aplicar normalização automática de espaçamento sem requisito específico.

## 11. Quebras de linha

Quebras de linha do arquivo devem ser preservadas na renderização.

## 12. Exemplo completo

```markdown
---
title: Tempo Perdido
artist: Legião Urbana
category: Rock
tags:
  - nacional
  - anos-80
author: Renato Russo
created_at: 2026-08-23
original_key: C
---

[C]             [Am]
Todos os dias quando acordo
Não tenho mais o tempo que passou

[Em]                 [F]
Não tenho medo do escuro
```

## 13. Regras de arquivo

Nome de arquivo recomendado:

```text
minúsculo-com-hífens.md
```

Sem acentos ou caracteres especiais no nome do arquivo.

Pasta do artista:

```text
artista-normalizado/
```

## 14. Validações futuras

A validação automatizada deverá impedir pelo menos:

- ausência de `title`;
- ausência de `artist`;
- ausência de `category`;
- ausência de `created_at`;
- ausência de `original_key`;
- Frontmatter inválido;
- uso incorreto da estrutura de colchetes conforme as regras do projeto;
- duplicidade de artista por grafias diferentes, quando isso puder ser detectado com segurança.
