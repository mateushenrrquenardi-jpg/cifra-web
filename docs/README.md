# Cifra Web

Aplicação web minimalista para consulta de cifras musicais, construída exclusivamente com HTML, CSS e JavaScript, com o catálogo de cifras mantido em arquivos Markdown no GitHub.

## Objetivo do MVP

O MVP deverá permitir:

- pesquisar músicas por nome;
- pesquisar músicas por artista;
- listar músicas;
- listar artistas;
- abrir e visualizar uma cifra;
- ajustar o tamanho da letra;
- entrar em tela cheia;
- esconder a interface automaticamente durante a leitura.

O MVP não terá backend tradicional, banco remoto, login, aplicativo nativo, PWA, domínio próprio, cache offline ou sincronização.

## Arquitetura resumida

```text
Usuário
   ↓
Navegador
   ↓
Aplicação Web (HTML/CSS/JS)
   ↓
GitHub Pages
   ↓
Catálogo de cifras em Markdown
```

O GitHub é a fonte oficial do conteúdo das cifras.

## Estrutura documental

- `docs/ARCHITECTURE.md` — arquitetura e responsabilidades.
- `docs/DATA_MODEL.md` — contrato dos arquivos de cifra e metadados.
- `docs/ROADMAP.md` — etapas de implementação.
- `docs/AI_CONTEXT.md` — contexto permanente para agentes de IA.
- `docs/AI_DEVELOPMENT.md` — processo operacional para desenvolvimento com IA.

## Estado do projeto

Fase atual: **Fase 03 — Importador de Cifras e Primeiro Catálogo (Concluída)**.
Próxima fase: **Fase 04 — Leitura de cifras**.

## Princípios

1. Manter o MVP simples.
2. Não adicionar backend ou dependências desnecessárias.
3. Não introduzir frameworks frontend.
4. Não alterar decisões arquiteturais sem atualizar a documentação.
5. Implementar uma funcionalidade por vez.
6. Fazer com que diferentes IAs consigam assumir o projeto lendo o repositório.
