/**
 * Cifra Web — Módulo de Extração de Metadados
 * Fase 03: Importador de Cifras
 */

'use strict';

import { getTodayFormatted } from './utils.js';

/**
 * Extrai metadados do texto bruto copiado de fontes externas
 * @param {string} rawText
 * @returns {object} { title, artist, originalKey, createdAt, category, tags, author, headerLineCount }
 */
export function extractMetadata(rawText) {
  const lines = rawText.split(/\r?\n/);
  
  let title = '';
  let artist = '';
  let originalKey = '';
  let author = '';
  let category = '';
  let tags = [];
  const createdAt = getTodayFormatted();

  let headerIndices = new Set();

  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // 1. Identificação do Tom (ex: "Tom: E", "Tom:  F#m", "Tom:Bb")
    const keyMatch = line.match(/^Tom\s*:\s*([A-G][#b]?(?:m|maj|min|dim|aug|sus)?(?:\d+)?(?:\/[A-G][#b]?)?)/i);
    if (keyMatch && !originalKey) {
      originalKey = keyMatch[1].trim();
      headerIndices.add(i);
      continue;
    }

    // 2. Identificação de Artista via Link Markdown: [Nome](URL)
    const linkArtistMatch = line.match(/^\[([^\]]+)\]\((?:https?:\/\/[^\)]+)\)$/i);
    if (linkArtistMatch && !artist) {
      artist = linkArtistMatch[1].trim();
      headerIndices.add(i);
      continue;
    }

    // 2.1 Identificação de Artista via prefixo explícito (ex: "Artista: Nome")
    const prefixArtistMatch = line.match(/^Artista\s*:\s*(.+)$/i);
    if (prefixArtistMatch && !artist) {
      artist = prefixArtistMatch[1].trim();
      headerIndices.add(i);
      continue;
    }

    // 2.2 Identificação de Autor/Compositor (ex: "Compositor: Nome", "Autor: Nome")
    const authorMatch = line.match(/^(?:Compositor|Autor)\s*:\s*(.+)$/i);
    if (authorMatch && !author) {
      author = authorMatch[1].trim();
      headerIndices.add(i);
      continue;
    }

    // 3. Identificação do Título (primeira linha textual ou com cabeçalho Markdown #)
    if (!title) {
      // Remove marcadores markdown de título como #, ##, etc.
      let candidate = line.replace(/^#+\s*/, '').trim();
      // Remove negrito no título se houver
      candidate = candidate.replace(/^\*\*|\*\*$/g, '').trim();

      // Se a linha não for um marcador estrutural ou tom, assumimos como título
      if (candidate && !candidate.startsWith('Tom:') && !candidate.startsWith('[Intro') && !candidate.startsWith('[Primeira')) {
        title = candidate;
        headerIndices.add(i);
        continue;
      }
    }

    // 4. Se já temos título e não temos artista, e a linha seguinte for texto simples sem ser tom ou seção
    if (title && !artist && !line.startsWith('Tom:') && !line.startsWith('[') && !line.startsWith('**')) {
      artist = line.trim();
      headerIndices.add(i);
      continue;
    }
  }

  return {
    title,
    artist,
    originalKey,
    createdAt,
    category,
    tags,
    author,
    headerIndices
  };
}
