/**
 * Cifra Web — Controlador da Interface do Importador de Cifras
 * Fase 03: Importador de Cifras
 */

'use strict';

import { parseSource } from './modules/parser.js';
import { validateCifraData } from './modules/validator.js';
import { generateMarkdown } from './modules/markdown-generator.js';
import { generateFilename, downloadMarkdownFile, copyToClipboard, getTodayFormatted } from './modules/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Cifra Web] Importador de Cifras carregado.');

  // Elementos do DOM
  const inputCifra = document.getElementById('input-cifra');
  const btnProcessar = document.getElementById('btn-processar');
  const btnExemplo = document.getElementById('btn-exemplo');
  
  // Seções de feedback e conteúdo
  const alertContainer = document.getElementById('alert-container');
  const sectionResult = document.getElementById('section-result');
  
  // Campos de Metadados
  const metaTitle = document.getElementById('meta-title');
  const metaArtist = document.getElementById('meta-artist');
  const metaCategory = document.getElementById('meta-category');
  const metaTags = document.getElementById('meta-tags');
  const metaAuthor = document.getElementById('meta-author');
  const metaCreatedAt = document.getElementById('meta-created-at');
  const metaOriginalKey = document.getElementById('meta-original-key');
  const metaBody = document.getElementById('meta-body');
  
  // Preview e Ações
  const previewFilename = document.getElementById('preview-filename');
  const previewMarkdown = document.getElementById('preview-markdown');
  const btnDownload = document.getElementById('btn-download');
  const btnCopy = document.getElementById('btn-copy');

  // Inicializa data atual se vazia
  if (metaCreatedAt && !metaCreatedAt.value) {
    metaCreatedAt.value = getTodayFormatted();
  }

  /**
   * Exibe mensagens de alerta amigáveis
   * @param {string|string[]} messages
   * @param {'error'|'success'|'info'} type
   */
  function showAlert(messages, type = 'error') {
    if (!alertContainer) return;
    
    const list = Array.isArray(messages) ? messages : [messages];
    const html = list.map(msg => `<p class="alert-message">${msg}</p>`).join('');
    
    alertContainer.className = `alert-box alert-${type}`;
    alertContainer.innerHTML = html;
    alertContainer.hidden = false;
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Oculta a caixa de alertas
   */
  function hideAlert() {
    if (alertContainer) {
      alertContainer.hidden = true;
      alertContainer.innerHTML = '';
    }
  }

  /**
   * Coleta os dados atuais do formulário de metadados
   * @returns {object}
   */
  function getFormData() {
    return {
      title: metaTitle.value.trim(),
      artist: metaArtist.value.trim(),
      category: metaCategory.value.trim(),
      tags: metaTags.value.trim(),
      author: metaAuthor.value.trim(),
      createdAt: metaCreatedAt.value.trim() || getTodayFormatted(),
      originalKey: metaOriginalKey.value.trim(),
      body: metaBody.value.trim()
    };
  }

  /**
   * Atualiza a pré-visualização do Markdown e o nome do arquivo gerado
   */
  function updatePreview() {
    const data = getFormData();
    const filename = generateFilename(data.title);
    previewFilename.textContent = filename;

    const markdown = generateMarkdown(data);
    previewMarkdown.textContent = markdown;
  }

  /**
   * Processa o texto bruto colado
   */
  function handleProcess() {
    hideAlert();
    const rawText = inputCifra.value.trim();

    if (!rawText) {
      showAlert('Por favor, cole o conteúdo da cifra antes de processar.', 'error');
      return;
    }

    try {
      const parsed = parseSource(rawText);

      // Preenche os campos do formulário
      metaTitle.value = parsed.title || '';
      metaArtist.value = parsed.artist || '';
      metaOriginalKey.value = parsed.originalKey || '';
      metaAuthor.value = parsed.author || '';
      metaCategory.value = parsed.category || 'Gospel'; // Categoria padrão sugestiva
      metaTags.value = Array.isArray(parsed.tags) ? parsed.tags.join(', ') : '';
      metaCreatedAt.value = parsed.createdAt || getTodayFormatted();
      metaBody.value = parsed.body || '';

      // Mostra a área de resultados e atualiza preview
      sectionResult.hidden = false;
      updatePreview();

      // Valida os dados para avisar caso falte algum campo obrigatório
      const validation = validateCifraData(getFormData());
      if (!validation.isValid) {
        showAlert(validation.errors, 'info');
      } else {
        showAlert('Cifra processada com sucesso! Revise os campos e clique em "Baixar .md" para salvar.', 'success');
      }

      sectionResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('[Cifra Web] Erro ao processar cifra:', error);
      showAlert(`Erro ao processar cifra: ${error.message}`, 'error');
    }
  }

  /**
   * Dispara o download do arquivo .md
   */
  function handleDownload() {
    hideAlert();
    const data = getFormData();
    const validation = validateCifraData(data);

    if (!validation.isValid) {
      showAlert(validation.errors, 'error');
      return;
    }

    const markdown = generateMarkdown(data);
    const filename = generateFilename(data.title);

    downloadMarkdownFile(filename, markdown);
    showAlert(`Arquivo "${filename}" gerado e baixado com sucesso!`, 'success');
  }

  /**
   * Copia o Markdown final para a área de transferência
   */
  async function handleCopy() {
    hideAlert();
    const data = getFormData();
    const validation = validateCifraData(data);

    if (!validation.isValid) {
      showAlert(validation.errors, 'error');
      return;
    }

    const markdown = generateMarkdown(data);
    const success = await copyToClipboard(markdown);

    if (success) {
      const originalText = btnCopy.textContent;
      btnCopy.textContent = '✓ Copiado!';
      btnCopy.classList.add('btn-success');
      setTimeout(() => {
        btnCopy.textContent = originalText;
        btnCopy.classList.remove('btn-success');
      }, 2500);
      showAlert('Markdown copiado para a área de transferência!', 'success');
    } else {
      showAlert('Não foi possível copiar automaticamente. Selecione e copie o texto da pré-visualização.', 'error');
    }
  }

  /**
   * Carrega o exemplo de teste "Ele É Exaltado"
   */
  function handleLoadExample() {
    const exampleText = `Ele É Exaltado
[Adhemar de Campos](https://www.cifraclub.com.br/adhemar-de-campos/)
Tom: E

[Intro] C D Em7 D

[Primeira Parte]
E
Ele é exaltado
     E/G#     A
O rei é exaltado nos céus
     F#m7    B7
Eu louvarei
E
Ele é exaltado
     E/G#     A
Pra sempre exaltado
   A/C# B/D# C#7(4/9)
Seu no - me  louvarei`;

    inputCifra.value = exampleText;
    handleProcess();
  }

  // Event Listeners
  if (btnProcessar) btnProcessar.addEventListener('click', handleProcess);
  if (btnExemplo) btnExemplo.addEventListener('click', handleLoadExample);
  if (btnDownload) btnDownload.addEventListener('click', handleDownload);
  if (btnCopy) btnCopy.addEventListener('click', handleCopy);

  // Atualização em tempo real ao editar qualquer metadado
  const formInputs = [metaTitle, metaArtist, metaCategory, metaTags, metaAuthor, metaCreatedAt, metaOriginalKey, metaBody];
  formInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        updatePreview();
      });
    }
  });
});
