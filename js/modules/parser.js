/**
 * Cifra Web — Módulo Parser Principal
 * Fase 03: Importador de Cifras
 */

'use strict';

import { extractMetadata } from './metadata.js';
import { formatCifraBody } from './formatter.js';

/**
 * Interpreta o texto bruto de uma cifra externa e retorna a estrutura organizada
 * @param {string} rawText
 * @returns {object} { title, artist, originalKey, author, createdAt, category, tags, body, sourceFormat }
 */
export function parseSource(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      title: '',
      artist: '',
      originalKey: '',
      author: '',
      createdAt: '',
      category: '',
      tags: [],
      body: '',
      sourceFormat: 'unknown'
    };
  }

  // 1. Extração de Metadados e identificação das linhas de cabeçalho
  const metadata = extractMetadata(rawText);

  // 2. Separação do corpo da cifra (excluindo as linhas consumidas pelos cabeçalhos)
  const lines = rawText.split(/\r?\n/);
  const bodyLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (metadata.headerIndices && metadata.headerIndices.has(i)) {
      continue;
    }
    bodyLines.push(lines[i]);
  }

  const rawBodyText = bodyLines.join('\n');

  // 3. Normalização e formatação da cifra e acordes
  const body = formatCifraBody(rawBodyText);

  return {
    title: metadata.title,
    artist: metadata.artist,
    originalKey: metadata.originalKey,
    author: metadata.author,
    createdAt: metadata.createdAt,
    category: metadata.category,
    tags: metadata.tags,
    body: body,
    sourceFormat: 'cifraclub'
  };
}
