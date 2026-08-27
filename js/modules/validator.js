/**
 * Cifra Web — Módulo de Validação
 * Fase 03: Importador de Cifras
 */

'use strict';

/**
 * Valida se os dados da cifra atendem aos requisitos de DATA_MODEL.md
 * @param {object} data
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export function validateCifraData(data) {
  const errors = [];

  if (!data) {
    return { isValid: false, errors: ['Nenhum dado informado para validação.'] };
  }

  // 1. Título (Obrigatório)
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('Título da música é obrigatório.');
  }

  // 2. Artista (Obrigatório)
  if (!data.artist || typeof data.artist !== 'string' || data.artist.trim() === '') {
    errors.push('Nome do artista é obrigatório.');
  }

  // 3. Categoria (Obrigatório)
  if (!data.category || typeof data.category !== 'string' || data.category.trim() === '') {
    errors.push('Categoria/Gênero musical é obrigatória.');
  }

  // 4. Data de Inclusão (Obrigatório no formato YYYY-MM-DD)
  if (!data.createdAt || typeof data.createdAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.createdAt.trim())) {
    errors.push('Data de inclusão deve estar no formato válido YYYY-MM-DD.');
  }

  // 5. Tom Original (Obrigatório)
  if (!data.originalKey || typeof data.originalKey !== 'string' || data.originalKey.trim() === '') {
    errors.push('Tom original não identificado. Informe o tom antes de gerar o arquivo.');
  }

  // 6. Corpo da Cifra (Obrigatório)
  if (!data.body || typeof data.body !== 'string' || data.body.trim() === '') {
    errors.push('O conteúdo da cifra não pode estar vazio.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
