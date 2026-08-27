/**
 * Cifra Web — Módulo de Carregamento do Catálogo
 * Fase 05: Listagem e Pesquisa
 *
 * ANTES (Fase 04 / primeira tentativa de Fase 05):
 *   Este módulo listava o catálogo chamando a API do GitHub
 *   (`api.github.com/.../git/trees`) a cada carregamento de página, e em
 *   seguida baixava o conteúdo COMPLETO de cada arquivo .md só para exibir
 *   título/artista na lista. A API do GitHub sem autenticação tem limite de
 *   60 requisições/hora POR IP — em redes compartilhadas (escola, empresa,
 *   4G/NAT) esse limite estoura rápido e a aplicação passa a mostrar erro
 *   de carregamento para todo mundo atrás daquele IP. Essa é a causa mais
 *   provável de a Fase 05 anterior "não funcionar" na prática.
 *
 * AGORA:
 *   A listagem usa um único arquivo estático `index.json`, mantido no
 *   repositório do catálogo (cifra-catalogo) e gerado a partir dos arquivos
 *   .md (ver cifra-catalogo/scripts/gerar-indice.js e o workflow do GitHub
 *   Actions que o mantém atualizado). Esse arquivo é lido via
 *   raw.githubusercontent.com, que é um CDN sem o limite de 60/h da API.
 *
 *   O corpo (letra + acordes) de cada música só é buscado quando o usuário
 *   efetivamente abre aquela música (carregamento sob demanda), também via
 *   raw.githubusercontent.com.
 *
 * Essa decisão resolve o ponto em aberto listado em ARCHITECTURE.md §17
 * ("mecanismo exato de busca; geração de índice de catálogo; formato do
 * índice; mecanismo de acesso aos arquivos remotos"). Documentado também
 * em ARCHITECTURE.md e DATA_MODEL.md.
 *
 * Regras: Vanilla JS puro, sem dependências.
 */

'use strict';

import { parseFrontmatter } from './frontmatter-parser.js';

// Configuração do repositório de catálogo
const GITHUB_OWNER = 'mateushenrrquenardi-jpg';
const GITHUB_REPO = 'cifra-catalogo';
const GITHUB_BRANCH = 'main';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const INDEX_URL = `${RAW_BASE}/index.json`;

/**
 * Carrega o índice do catálogo (apenas metadados, sem o corpo das cifras).
 *
 * @returns {Promise<Array<{ path: string, metadata: object, body: null }>>}
 */
export async function loadCatalog() {
  console.log('[Cifra Web] Carregando índice do catálogo...');

  const response = await fetch(INDEX_URL, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(
      `Não foi possível carregar index.json (HTTP ${response.status}). ` +
      `Verifique se o arquivo existe na raiz do repositório "${GITHUB_REPO}".`
    );
  }

  const data = await response.json();
  const songs = Array.isArray(data.songs) ? data.songs : [];

  console.log(`[Cifra Web] Catálogo carregado: ${songs.length} cifra(s).`);

  // Normaliza cada entrada do índice para o formato usado pela UI
  // ({ path, metadata, body }), mantendo `body` como null até ser
  // carregado sob demanda por loadSongBody().
  return songs.map((song) => ({
    path: song.path,
    metadata: {
      title: song.title,
      artist: song.artist,
      category: song.category,
      tags: song.tags || [],
      author: song.author || undefined,
      created_at: song.created_at,
      original_key: song.original_key
    },
    body: null
  }));
}

/**
 * Busca o conteúdo completo (letra + acordes) de UMA música, sob demanda.
 * Usado quando o usuário abre uma cifra específica para visualização.
 *
 * @param {string} filePath — Caminho relativo no repositório de catálogo
 *   (ex: "musicas/adhemar-de-campos/ele-e-exaltado.md")
 * @returns {Promise<{ metadata: object, body: string }>}
 */
export async function loadSongBody(filePath) {
  const response = await fetch(`${RAW_BASE}/${filePath}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Não foi possível carregar "${filePath}" (HTTP ${response.status}).`);
  }

  const content = await response.text();
  return parseFrontmatter(content);
}

/**
 * Agrupa as cifras por artista.
 *
 * @param {Array<{ path: string, metadata: object, body: string|null }>} catalog
 * @returns {Map<string, Array>} — Mapa artista → array de cifras
 */
export function groupByArtist(catalog) {
  const artistMap = new Map();

  for (const item of catalog) {
    const artist = item.metadata.artist || 'Desconhecido';
    if (!artistMap.has(artist)) {
      artistMap.set(artist, []);
    }
    artistMap.get(artist).push(item);
  }

  return artistMap;
}

/**
 * Exporta configurações do repositório para uso em outros módulos.
 */
export const REPO_CONFIG = {
  owner: GITHUB_OWNER,
  repo: GITHUB_REPO,
  branch: GITHUB_BRANCH,
  rawBase: RAW_BASE,
  indexUrl: INDEX_URL
};
