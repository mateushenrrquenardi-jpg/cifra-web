/**
 * Cifra Web — Módulo Gerador de Markdown
 * Fase 03: Importador de Cifras
 */

'use strict';

/**
 * Gera o arquivo Markdown final com YAML Frontmatter padronizado e corpo da cifra
 * @param {object} data { title, artist, category, tags, author, createdAt, originalKey, body }
 * @returns {string}
 */
export function generateMarkdown(data) {
  const lines = ['---'];

  // 1. title (Obrigatório)
  lines.push(`title: ${data.title.trim()}`);

  // 2. artist (Obrigatório)
  lines.push(`artist: ${data.artist.trim()}`);

  // 3. category (Obrigatório)
  lines.push(`category: ${data.category.trim()}`);

  // 4. tags (Lista YAML)
  const tags = Array.isArray(data.tags)
    ? data.tags.filter(t => t && t.trim() !== '')
    : (typeof data.tags === 'string'
        ? data.tags.split(',').map(t => t.trim()).filter(t => t !== '')
        : []);

  if (tags.length > 0) {
    lines.push('tags:');
    tags.forEach(tag => {
      lines.push(`  - ${tag}`);
    });
  } else {
    lines.push('tags: []');
  }

  // 5. author (Opcional - omitido se vazio)
  if (data.author && data.author.trim() !== '') {
    lines.push(`author: ${data.author.trim()}`);
  }

  // 6. created_at (Obrigatório)
  lines.push(`created_at: ${data.createdAt.trim()}`);

  // 7. original_key (Obrigatório)
  lines.push(`original_key: ${data.originalKey.trim()}`);

  lines.push('---');
  lines.push('');

  // 8. Corpo da Cifra
  lines.push(data.body.trim());
  lines.push(''); // Linha em branco final padrão POSIX

  return lines.join('\n');
}
