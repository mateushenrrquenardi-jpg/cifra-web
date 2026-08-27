/**
 * Cifra Web — Módulo de Utilitários
 * Fase 03: Importador de Cifras
 */

'use strict';

/**
 * Normaliza um texto para formato slug (ex: "Ele É Exaltado" -> "ele-e-exaltado.md")
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .normalize('NFD')                     // Separa acentos dos caracteres base
    .replace(/[\u0300-\u036f]/g, '')     // Remove marcas de acentuação
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')        // Remove caracteres especiais
    .replace(/\s+/g, '-')                // Substitui espaços por hífens
    .replace(/-+/g, '-')                 // Evita múltiplos hífens consecutivos
    .replace(/^-+|-+$/g, '');            // Remove hífens no início e fim
}

/**
 * Gera o nome de arquivo normalizado com extensão .md
 * @param {string} title
 * @returns {string}
 */
export function generateFilename(title) {
  const slug = slugify(title);
  return slug ? `${slug}.md` : 'cifra.md';
}

/**
 * Retorna a data atual no formato YYYY-MM-DD
 * @returns {string}
 */
export function getTodayFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Cria um Blob e dispara o download do arquivo Markdown no navegador do usuário
 * @param {string} filename
 * @param {string} content
 */
export function downloadMarkdownFile(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Copia um texto para a área de transferência usando a Clipboard API moderna
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para contextos não-HTTPS locais
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch (err) {
    console.error('[Cifra Web] Erro ao copiar para a área de transferência:', err);
    return false;
  }
}

/**
 * Escapa caracteres HTML para exibição segura em templates
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
