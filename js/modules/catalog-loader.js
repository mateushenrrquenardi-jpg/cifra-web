/**
 * Cifra Web — Módulo de Carregamento do Catálogo
 * Fase 05 & 06: Listagem, Pesquisa & Experiência de Leitura
 * 
 * Regras: Vanilla JS puro, sem dependências.
 * 
 * Carregamento resiliente:
 * 1. Tenta index.json via raw.githubusercontent.com (CDN sem rate limit).
 * 2. Suporta tanto formato em array quanto formato de objeto `{ songs: [...] }`.
 * 3. Fallback via API REST do GitHub (/git/trees) se index.json falhar.
 * 4. Carregamento sob demanda via loadSongBody() se a música ainda não possuir o corpo baixado.
 */

'use strict';

import { parseFrontmatter } from './frontmatter-parser.js';

// Configuração do repositório
const GITHUB_OWNER = 'mateushenrrquenardi-jpg';
const GITHUB_REPO = 'cifra-catalogo';
const GITHUB_BRANCH = 'main';
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const INDEX_URL = `${RAW_BASE}/index.json`;

/**
 * Tenta carregar o índice pré-compilado (index.json) via CDN do GitHub.
 * 
 * @returns {Promise<Array<{ path: string, metadata: object, body: string|null }>|null>}
 */
async function loadFromIndexJson() {
  try {
    const url = `${INDEX_URL}?t=${Date.now()}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json, text/plain, */*' }
    });

    if (!response.ok) {
      throw new Error(`index.json retornou HTTP ${response.status}`);
    }

    const text = await response.text();
    const data = JSON.parse(text);

    let rawList = [];
    if (Array.isArray(data)) {
      rawList = data;
    } else if (data && Array.isArray(data.songs)) {
      rawList = data.songs;
    }

    if (rawList.length > 0) {
      console.log(`[Cifra Web] Catálogo carregado via index.json (${rawList.length} cifra(s)).`);
      return rawList.map(item => {
        // Se a entrada já possui metadata estruturada
        if (item.metadata) {
          return {
            path: item.path,
            metadata: item.metadata,
            body: item.body || null
          };
        }
        // Se a entrada usa o formato plano { path, title, artist, ... }
        return {
          path: item.path,
          metadata: {
            title: item.title || item.path.split('/').pop().replace('.md', ''),
            artist: item.artist || 'Desconhecido',
            category: item.category || 'Gospel',
            tags: item.tags || [],
            author: item.author,
            created_at: item.created_at || item.createdAt,
            original_key: item.original_key || item.originalKey || ''
          },
          body: item.body || null
        };
      });
    }

    return null;
  } catch (error) {
    console.warn('[Cifra Web] Não foi possível carregar index.json:', error.message);
    return null;
  }
}

/**
 * Fallback: Lista os arquivos do catálogo via API de árvores do GitHub.
 * 
 * @returns {Promise<string[]>}
 */
async function listCatalogFiles() {
  try {
    const response = await fetch(`${API_BASE}/git/trees/${GITHUB_BRANCH}?recursive=1`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!response.ok) {
      throw new Error(`GitHub API retornou ${response.status}`);
    }

    const data = await response.json();

    return (data.tree || [])
      .filter(item => item.type === 'blob' && item.path.startsWith('musicas/') && item.path.endsWith('.md'))
      .map(item => item.path);
  } catch (error) {
    console.error('[Cifra Web] Erro ao listar arquivos do catálogo via GitHub API:', error);
    return [];
  }
}

/**
 * Obtém o conteúdo bruto de um arquivo .md do repositório.
 * 
 * @param {string} filePath
 * @returns {Promise<string|null>}
 */
async function fetchFileContent(filePath) {
  try {
    const response = await fetch(`${RAW_BASE}/${filePath}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar ${filePath}: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`[Cifra Web] Erro ao buscar conteúdo de ${filePath}:`, error);
    return null;
  }
}

/**
 * Fallback: Carrega o catálogo escaneando todos os arquivos .md via API do GitHub.
 * 
 * @returns {Promise<Array<{ path: string, metadata: object, body: string }>>}
 */
async function loadFromGitHubTree() {
  console.log('[Cifra Web] Tentando carregar catálogo via API do GitHub...');

  const filePaths = await listCatalogFiles();
  if (filePaths.length === 0) return [];

  console.log(`[Cifra Web] Encontrados ${filePaths.length} arquivo(s) via API.`);

  const results = await Promise.all(
    filePaths.map(async (filePath) => {
      const content = await fetchFileContent(filePath);
      if (!content) return null;

      const { metadata, body } = parseFrontmatter(content);

      return {
        path: filePath,
        metadata,
        body
      };
    })
  );

  return results.filter(item => item !== null);
}

/**
 * Carrega todo o catálogo utilizando estratégias em cascata.
 * 
 * @returns {Promise<Array<{ path: string, metadata: object, body: string|null }>>}
 */
export async function loadCatalog() {
  console.log('[Cifra Web] Iniciando carregamento do catálogo...');

  // Estratégia 1: index.json (Raw CDN, sem rate limit)
  const indexData = await loadFromIndexJson();
  if (indexData) {
    return indexData;
  }

  // Estratégia 2: GitHub API Tree Fallback
  const treeData = await loadFromGitHubTree();
  if (treeData && treeData.length > 0) {
    return treeData;
  }

  console.warn('[Cifra Web] Nenhuma cifra foi carregada.');
  return [];
}

/**
 * Busca o conteúdo completo (letra + acordes) de UMA música sob demanda.
 * 
 * @param {string} filePath — Caminho relativo (ex: "musicas/adhemar-de-campos/ele-e-exaltado.md")
 * @returns {Promise<{ metadata: object, body: string }>}
 */
export async function loadSongBody(filePath) {
  const content = await fetchFileContent(filePath);
  if (!content) {
    throw new Error(`Não foi possível carregar "${filePath}".`);
  }
  return parseFrontmatter(content);
}

/**
 * Agrupa as cifras por artista.
 * 
 * @param {Array<{ path: string, metadata: object, body: string|null }>} catalog
 * @returns {Map<string, Array>}
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
 * Exporta configurações do repositório.
 */
export const REPO_CONFIG = {
  owner: GITHUB_OWNER,
  repo: GITHUB_REPO,
  branch: GITHUB_BRANCH,
  rawBase: RAW_BASE,
  apiBase: API_BASE,
  indexUrl: INDEX_URL
};
