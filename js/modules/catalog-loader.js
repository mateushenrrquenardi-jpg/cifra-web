/**
 * Cifra Web — Módulo de Carregamento Dinâmico do Catálogo
 * Fase 04: Catálogo Dinâmico
 * 
 * Busca os arquivos do catálogo no repositório cifra-catalogo via GitHub API
 * e extrai os metadados de cada cifra para renderização na página principal.
 * 
 * Regras: Vanilla JS puro, sem backend, sem dependências.
 */

'use strict';

import { parseFrontmatter } from './frontmatter-parser.js';

// Configuração do repositório
const GITHUB_OWNER = 'mateushenrrquenardi-jpg';
const GITHUB_REPO = 'cifra-catalogo';
const GITHUB_BRANCH = 'main';
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

/**
 * Lista recursivamente todas as pastas de artistas dentro de musicas/
 * e retorna os caminhos dos arquivos .md encontrados.
 * 
 * @returns {Promise<string[]>} — Array de caminhos relativos (ex: "musicas/adhemar-de-campos/ele-e-exaltado.md")
 */
async function listCatalogFiles() {
  try {
    // Usar a API de árvore recursiva para obter todos os arquivos de uma vez
    const response = await fetch(`${API_BASE}/git/trees/${GITHUB_BRANCH}?recursive=1`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!response.ok) {
      throw new Error(`GitHub API retornou ${response.status}`);
    }

    const data = await response.json();

    // Filtrar apenas arquivos .md dentro de musicas/
    return data.tree
      .filter(item => item.type === 'blob' && item.path.startsWith('musicas/') && item.path.endsWith('.md'))
      .map(item => item.path);
  } catch (error) {
    console.error('[Cifra Web] Erro ao listar arquivos do catálogo:', error);
    return [];
  }
}

/**
 * Obtém o conteúdo bruto de um arquivo .md do repositório.
 * 
 * @param {string} filePath — Caminho relativo no repositório (ex: "musicas/adhemar-de-campos/ele-e-exaltado.md")
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
 * Carrega todo o catálogo: lista arquivos, busca conteúdos e extrai metadados.
 * 
 * @returns {Promise<Array<{ path: string, metadata: object, body: string }>>}
 */
export async function loadCatalog() {
  console.log('[Cifra Web] Carregando catálogo do GitHub...');

  const filePaths = await listCatalogFiles();

  if (filePaths.length === 0) {
    console.warn('[Cifra Web] Nenhum arquivo encontrado no catálogo.');
    return [];
  }

  console.log(`[Cifra Web] Encontrados ${filePaths.length} arquivo(s) no catálogo.`);

  // Buscar conteúdo de todos os arquivos em paralelo
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

  // Filtrar nulls
  const catalog = results.filter(item => item !== null);
  console.log(`[Cifra Web] Catálogo carregado: ${catalog.length} cifra(s).`);

  return catalog;
}

/**
 * Agrupa as cifras por artista.
 * 
 * @param {Array<{ path: string, metadata: object, body: string }>} catalog
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
  apiBase: API_BASE,
  rawBase: RAW_BASE
};
