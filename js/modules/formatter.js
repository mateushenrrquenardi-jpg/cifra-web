/**
 * Cifra Web — Módulo de Formatação e Reconhecimento de Acordes
 * Fase 03: Importador de Cifras
 */

'use strict';

/**
 * Regex para identificação precisa de acordes musicais
 * Reconhece:
 * - Notas base: [A-G]
 * - Acidentes: #, b, ♯, ♭
 * - Qualidades: m, M, maj, min, dim, aug, sus, add, º, °, +, -, etc.
 * - Extensões e tensões: 7, 7M, 7+, 9, 11, 13, (9), (#11), (4/9), (b5), etc.
 * - Baixos invertidos: /A, /C#, /G#, etc.
 */
export const CHORD_REGEX = /^[A-G][#b♯♭]?(?:maj|min|m|M|dim|aug|sus|add|º|°|\+|\-)?(?:\d+(?:M|m|\+|\-)?|\([^\)]+\)|[#b]\d+)*(?:\/[A-G][#b♯♭]?)?$/;

/**
 * Regex para identificar marcadores de seção comuns de sites de cifras
 */
export const SECTION_MARKERS_REGEX = /\[(?:intro(?:dução|ducao)?|primeira parte|segunda parte|terceira parte|quarta parte|refrão|refrao|ponte|solo|final|interlúdio|interludio|pré-refrão|pre-refrão|pre-refrao|estrofe|verso|outro|chorus|bridge|verse|hook)(?::[^\]]*)?\]/gi;

/**
 * Palavras comuns em português que não devem ser confundidas com acordes em linhas de letra
 */
const PORTUGUESE_STOPWORDS = new Set([
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
  'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
  'e', 'ou', 'se', 'mas', 'que', 'com', 'por', 'pra', 'para',
  'eu', 'tu', 'ele', 'ela', 'nos', 'nós', 'vos', 'vós', 'eles', 'elas',
  'meu', 'minha', 'teu', 'tua', 'seu', 'sua', 'nosso', 'nossa',
  'não', 'nao', 'sim', 'já', 'ja', 'ao', 'aos', 'à', 'às', 'pelo', 'pela',
  'rei', 'céu', 'céus', 'terra', 'senhor', 'deus', 'amor', 'dia', 'tempo'
]);

/**
 * Verifica se um token individual é um acorde musical válido
 * @param {string} token
 * @returns {boolean}
 */
export function isChord(token) {
  if (!token) return false;
  // Remove colchetes se já estiverem presentes, ex: [C] -> C
  let clean = token.replace(/^\[([^\]]+)\]$/, '$1').trim();
  return CHORD_REGEX.test(clean);
}

/**
 * Determina se uma linha de texto deve ser tratada como linha de acordes
 * @param {string} line
 * @returns {boolean}
 */
export function isChordLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;

  // Se a linha tiver marcação explícita em negrito de acordes (ex: **E** ou **E/G#**)
  if (/\*\*[A-G][^\*]*\*\*/.test(line)) {
    return true;
  }

  // Divide a linha em tokens não-vazios
  const tokens = trimmed.split(/\s+/);
  if (tokens.length === 0) return false;

  let chordCount = 0;
  let lyricWordCount = 0;

  for (const token of tokens) {
    const cleanToken = token.replace(/[.,:;!?]/g, '');

    if (isChord(cleanToken)) {
      chordCount++;
    } else {
      lyricWordCount++;
    }
  }

  // Se todos os tokens forem acordes válidos
  if (chordCount === tokens.length) {
    return true;
  }

  // Se a maioria dos tokens forem acordes e não houver palavras de letra comuns
  return chordCount > 0 && lyricWordCount === 0;
}

/**
 * Converte uma linha de acordes para o formato [ACORDE] preservando o espaçamento relativo exato
 * @param {string} line
 * @returns {string}
 */
export function formatChordLine(line) {
  // 1. Trata acordes já demarcados com **ACORDE**
  if (/\*\*[A-G][^\*]*\*\*/.test(line)) {
    return line.replace(/\*\*([A-G][#b♯♭]?(?:maj|min|m|M|dim|aug|sus|add|º|°|\+|\-)?(?:\d+(?:M|m|\+|\-)?|\([^\)]+\)|[#b]\d+)*(?:\/[A-G][#b♯♭]?)?)\*\*/g, '[$1]');
  }

  // 2. Trata acordes em texto puro identificando posições e substituindo de forma segura
  // Regex global com captura de limites de palavra/espaços
  const tokenRegex = /\S+/g;
  let match;
  const replacements = [];

  while ((match = tokenRegex.exec(line)) !== null) {
    const token = match[0];
    const index = match.index;

    if (isChord(token)) {
      replacements.push({
        start: index,
        end: index + token.length,
        replacement: `[${token}]`
      });
    }
  }

  // Se nenhum acorde foi formatado, retorna a linha original
  if (replacements.length === 0) {
    return line;
  }

  // Aplica as substituições de trás para frente para manter os índices absolutos consistentes
  let result = line;
  for (let i = replacements.length - 1; i >= 0; i--) {
    const rep = replacements[i];
    result = result.substring(0, rep.start) + rep.replacement + result.substring(rep.end);
  }

  return result;
}

/**
 * Limpa e normaliza o corpo da cifra:
 * - Remove marcadores de seção ([Intro], [Refrão], etc.)
 * - Converte acordes para [ACORDE]
 * - Preserva espaços e quebras de linha
 * - Preserva texto da letra intacto
 * @param {string} rawBody
 * @returns {string}
 */
export function formatCifraBody(rawBody) {
  if (!rawBody) return '';

  // Normaliza quebras de linha para \n e tabs para espaços
  let text = rawBody
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00A0/g, ' ')  // Remove non-breaking spaces
    .replace(/\t/g, '  ');     // Converte tabs para 2 espaços

  const rawLines = text.split('\n');
  const processedLines = [];

  for (let line of rawLines) {
    // 1. Remove marcadores de seção da fonte (ex: [Intro], [Primeira Parte], etc.)
    let cleanedLine = line.replace(SECTION_MARKERS_REGEX, '');

    // Se a linha continha apenas o marcador de seção e ficou vazia
    if (cleanedLine.trim() === '' && line.trim() !== '') {
      // Mantém uma linha vazia para separar estrofes/seções naturalmente
      if (processedLines.length > 0 && processedLines[processedLines.length - 1].trim() !== '') {
        processedLines.push('');
      }
      continue;
    }

    // 2. Verifica se a linha limpa é uma linha de acordes
    if (isChordLine(cleanedLine)) {
      processedLines.push(formatChordLine(cleanedLine));
    } else {
      // É uma linha de letra ou mista: remove apenas formatação de negrito/itálico desnecessária
      const cleanLyricLine = cleanedLine
        .replace(/\*\*|\_\_/g, '') // Remove negrito residual
        .replace(/<[^>]*>/g, '');  // Remove tags HTML se houver

      processedLines.push(cleanLyricLine);
    }
  }

  // Remove linhas em branco consecutivas em excesso (máximo 1 linha em branco entre blocos)
  const finalLines = [];
  let prevBlank = true;

  for (const line of processedLines) {
    const isBlank = line.trim() === '';
    if (isBlank) {
      if (!prevBlank) {
        finalLines.push('');
      }
      prevBlank = true;
    } else {
      finalLines.push(line.replace(/\s+$/, '')); // Remove apenas espaços residuais no final da linha
      prevBlank = false;
    }
  }

  return finalLines.join('\n').trim();
}
