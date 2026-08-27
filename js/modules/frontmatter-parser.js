/**
 * Cifra Web — Módulo de Parse de Front-matter YAML
 * Fase 04: Catálogo Dinâmico
 * 
 * Extrai metadados YAML do conteúdo bruto de um arquivo Markdown.
 * Regras: Vanilla JS puro, sem dependências.
 */

'use strict';

/**
 * Extrai o front-matter YAML de um conteúdo Markdown bruto.
 * O front-matter é delimitado por linhas contendo exatamente "---".
 * 
 * @param {string} content — Conteúdo completo do arquivo .md
 * @returns {{ metadata: object, body: string }}
 */
export function parseFrontmatter(content) {
  if (!content || typeof content !== 'string') {
    return { metadata: {}, body: '' };
  }

  const trimmed = content.trim();

  // Verificar se inicia com "---"
  if (!trimmed.startsWith('---')) {
    return { metadata: {}, body: trimmed };
  }

  // Encontrar o segundo "---"
  const secondDashIndex = trimmed.indexOf('---', 3);
  if (secondDashIndex === -1) {
    return { metadata: {}, body: trimmed };
  }

  const yamlBlock = trimmed.substring(3, secondDashIndex).trim();
  const body = trimmed.substring(secondDashIndex + 3).trim();

  const metadata = parseSimpleYaml(yamlBlock);

  return { metadata, body };
}

/**
 * Parser simples de YAML para front-matter de cifras.
 * Suporta: chave: valor, listas YAML com "  - item"
 * Não é um parser YAML completo — cobre apenas o subconjunto usado pelo projeto.
 * 
 * @param {string} yamlText
 * @returns {object}
 */
function parseSimpleYaml(yamlText) {
  const result = {};
  const lines = yamlText.split('\n');
  let currentKey = null;
  let currentList = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Pular linhas vazias
    if (!trimmedLine) continue;

    // Verificar se é item de lista "  - valor"
    const listItemMatch = trimmedLine.match(/^-\s+(.*)$/);
    if (listItemMatch && currentKey && currentList !== null) {
      currentList.push(listItemMatch[1].trim());
      continue;
    }

    // Se tínhamos uma lista sendo construída, salvar
    if (currentKey && currentList !== null) {
      result[currentKey] = currentList;
      currentKey = null;
      currentList = null;
    }

    // Verificar se é "chave: valor" ou "chave:"
    const kvMatch = trimmedLine.match(/^([a-z_][a-z0-9_]*)\s*:\s*(.*)$/i);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const value = kvMatch[2].trim();

      if (value === '' || value === '[]') {
        // Pode ser início de lista ou valor vazio
        currentKey = key;
        currentList = [];
      } else {
        result[key] = value;
        currentKey = null;
        currentList = null;
      }
    }
  }

  // Salvar última lista pendente
  if (currentKey && currentList !== null) {
    result[currentKey] = currentList;
  }

  return result;
}
