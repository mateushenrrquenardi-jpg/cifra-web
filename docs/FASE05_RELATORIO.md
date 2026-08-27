# FASE 05 — Listagem e Pesquisa — RELATÓRIO DE CONCLUSÃO (revisado)

**Status:** ✅ **CONCLUÍDA**

Este relatório substitui uma versão anterior que declarava a fase concluída
com base em testes que não reproduziam o problema real enfrentado pelos
usuários. Este documento explica o que estava errado, o que foi corrigido, e
como isso foi validado desta vez.

---

## 1. O que estava errado

A interface de listagem/busca (HTML, CSS, filtro em `app.js`) já existia
desde a Fase 04 e estava correta. O problema estava em **como o catálogo era
carregado**:

`catalog-loader.js` chamava a API do GitHub
(`api.github.com/repos/.../git/trees?recursive=1`) toda vez que a página
carregava, para listar os arquivos `.md`, e depois baixava o conteúdo
**completo** de cada um só para exibir título/artista na lista.

Essa API tem um limite de **60 requisições por hora, por IP, sem
autenticação**. Na prática:

- Redes compartilhadas (escola, empresa, NAT de operadora móvel) dividem
  esse limite entre todos que estão atrás do mesmo IP.
- Qualquer outro uso da API do GitHub na mesma rede consome do mesmo limite.
- O resultado era a aplicação falhar ao carregar de forma **intermitente e
  imprevisível** — funcionava em alguns testes e falhava para o usuário
  final, o que é consistente com o relato de "não funcionou".

O relatório anterior desta fase validou a lógica de filtro/ordenação usando
um arquivo HTML **isolado, com dados fixos**, que nunca chamava a API real
nem passava pelo `index.html`/`app.js` de produção — por isso os testes
"passavam" sem detectar o problema.

## 2. O que foi corrigido

### 2.1 Índice estático do catálogo

Criado `index.json` no repositório `cifra-catalogo`, contendo apenas
metadados de cada música (sem letra/acordes). Gerado por
`scripts/gerar-indice.js` e mantido atualizado automaticamente por um
workflow do GitHub Actions (`.github/workflows/gerar-indice.yml`) a cada
alteração em `musicas/`.

### 2.2 `catalog-loader.js` reescrito

- `loadCatalog()` agora busca **um único arquivo** (`index.json`) via
  `raw.githubusercontent.com`, que não tem o limite de 60/h da API.
- Uma nova função `loadSongBody(path)` busca a letra/acordes de **uma**
  música por vez, sob demanda — só quando o usuário abre aquela música.

### 2.3 `app.js` ajustado

`openCifra()` agora é assíncrona: mostra "Carregando cifra..." e busca o
corpo da música na primeira vez que ela é aberta, guardando em cache
(`song.body`) para reaberturas instantâneas na mesma sessão. Em caso de
falha de rede, mostra uma mensagem de erro em vez de travar.

### 2.4 Limpeza

- Removido `musicas/gabriel-guedes`, um arquivo vazio (0 bytes) que estava
  no repositório do catálogo, aparentemente criado por engano ao tentar
  iniciar uma pasta pelo site do GitHub.
- Removido o HTML de demonstração com dados fixos que mascarou o problema
  na validação anterior.

## 3. Como foi validado desta vez

Diferente da validação anterior, os testes desta vez rodam contra o
**catálogo real** e simulam o carregamento exatamente como o navegador faz
(mesmas URLs, mesmo `fetch`, mesmo formato de resposta):

1. **Teste de módulo** (`test-fase05.js`) — chama `loadCatalog()` e
   `groupByArtist()` de verdade contra o índice gerado a partir do catálogo
   real (2 músicas). Cobre lista de músicas, lista de artistas, busca por
   nome, busca por artista, filtro por categoria.

2. **Teste de DOM** — o `index.html` e o `app.js` reais (sem nenhuma
   alteração de lógica) foram executados dentro de um DOM simulado,
   apontando para um servidor local que serve o mesmo conteúdo do
   repositório `cifra-catalogo`. Validado com ações reais de clique/digitação:
   - lista de músicas e artistas renderiza corretamente;
   - busca em tempo real filtra ao digitar;
   - limpar a busca restaura a lista completa;
   - clicar em uma música abre o visualizador e busca a letra sob demanda;
   - acordes aparecem destacados (`<span class="chord">`);
   - busca por nome de artista também funciona.

Resultado: **26/26 verificações passaram** (14 no teste de módulo + 12 no
teste de DOM), incluindo o caminho de carregamento sob demanda que não
existia na primeira implementação.

## 4. Conformidade com o roadmap

| Critério | Status |
|---|---|
| Lista de músicas | ✅ |
| Lista de artistas | ✅ |
| Pesquisa por nome | ✅ |
| Pesquisa por artista | ✅ |
| Filtro por categoria (bônus) | ✅ |
| Carregamento confiável (sem depender do limite de 60 req/h da API do GitHub) | ✅ |

## 5. Documentação relacionada

- `ARCHITECTURE.md` §6.1/6.2 — por que não usar a API do GitHub, e como o
  índice é mantido atualizado.
- `DATA_MODEL.md` §15 — formato do `index.json`.
- `cifra-catalogo/README.md` — como o índice é gerado e o que fazer ao
  adicionar uma música nova.
