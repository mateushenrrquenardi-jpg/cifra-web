/**
 * Cifra Web — Controlador da Página Dedicada do Visualizador
 * Fase 06: Experiência de Leitura Dedicada
 * 
 * Regras: Vanilla JavaScript puro, sem dependências.
 */

'use strict';

import { loadSongBody } from './modules/catalog-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Cifra Web] Visualizador carregado.');

  // Elementos da interface
  const statusDiv = document.getElementById('viewer-status');
  const statusTitle = document.getElementById('status-title');
  const statusDesc = document.getElementById('status-desc');
  const viewerContainer = document.getElementById('cifra-viewer-container');
  const viewerSongTitle = document.getElementById('viewer-song-title');
  const viewerArtistName = document.getElementById('viewer-artist-name');
  const cifraBody = document.getElementById('cifra-body');
  
  const btnFontDec = document.getElementById('btn-font-dec');
  const btnFontInc = document.getElementById('btn-font-inc');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const headerNav = document.querySelector('.viewer-header-nav');

  let currentFontSize = 1; // rem
  let uiHideTimeout;
  const UI_HIDE_DELAY = 3000; // 3 segundos
  let uiHidden = false;

  // 1. Obter o parâmetro de caminho da cifra pela URL
  const params = new URLSearchParams(window.location.search);
  const songPath = params.get('path');

  if (!songPath) {
    showError('Cifra não especificada', 'Por favor, volte para a página inicial e escolha uma música.');
    return;
  }

  // 2. Carregar a cifra
  try {
    const song = await loadSongBody(songPath);
    renderSong(song);
  } catch (error) {
    console.error('[Cifra Web] Erro ao carregar cifra:', error);
    showError('Erro ao carregar', 'Não foi possível carregar o conteúdo desta cifra do repositório.');
  }

  /**
   * Renderiza a cifra no visualizador
   * @param {{ metadata: object, body: string }} song
   */
  function renderSong(song) {
    // Esconder placeholder de status
    if (statusDiv) statusDiv.hidden = true;

    // Atualizar metadados
    viewerSongTitle.textContent = song.metadata.title || 'Sem título';
    viewerArtistName.textContent = song.metadata.artist || 'Desconhecido';
    document.title = `${song.metadata.title} - ${song.metadata.artist} | Cifra Web`;

    // Atualizar corpo da cifra com tags de acordes destacadas
    const codeEl = cifraBody.querySelector('code');
    if (codeEl) {
      codeEl.innerHTML = renderCifraBody(song.body);
    }

    // Exibir contêiner principal
    viewerContainer.hidden = false;
  }

  /**
   * Renderiza o corpo com classes CSS para acordes
   * @param {string} body
   * @returns {string} HTML
   */
  function renderCifraBody(body) {
    if (!body) return '';
    const escaped = escapeHtml(body);
    return escaped.replace(/\[([^\]]+)\]/g, '<span class="chord">$1</span>');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showError(title, desc) {
    if (statusDiv) {
      statusDiv.querySelector('.placeholder-icon').textContent = '⚠️';
      statusTitle.textContent = title;
      statusDesc.textContent = desc;
    }
  }

  // ── Controles de Tamanho de Fonte ──

  if (btnFontDec) {
    btnFontDec.addEventListener('click', () => {
      currentFontSize = Math.max(0.6, currentFontSize - 0.1);
      cifraBody.style.fontSize = `${currentFontSize}rem`;
    });
  }

  if (btnFontInc) {
    btnFontInc.addEventListener('click', () => {
      currentFontSize = Math.min(2.5, currentFontSize + 0.1);
      cifraBody.style.fontSize = `${currentFontSize}rem`;
    });
  }

  // ── Modo Tela Cheia e Ocultação de UI (Fase 06) ──

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  function showUI() {
    const controlsHeader = viewerContainer.querySelector('.viewer-header');
    if (controlsHeader) controlsHeader.classList.remove('hidden-ui');
    if (headerNav) headerNav.classList.remove('hidden-ui');
    
    uiHidden = false;
    clearTimeout(uiHideTimeout);
    
    if (document.fullscreenElement) {
      uiHideTimeout = setTimeout(hideUI, UI_HIDE_DELAY);
    }
  }

  function hideUI() {
    if (!document.fullscreenElement) return; // Só esconde em fullscreen
    
    const controlsHeader = viewerContainer.querySelector('.viewer-header');
    if (controlsHeader) controlsHeader.classList.add('hidden-ui');
    if (headerNav) headerNav.classList.add('hidden-ui');
    
    uiHidden = true;
  }

  // Mousemove e Keydown restabelecem a UI
  document.addEventListener('mousemove', () => {
    if (document.fullscreenElement && uiHidden) {
      showUI();
    }
  });

  document.addEventListener('keydown', () => {
    if (document.fullscreenElement && uiHidden) {
      showUI();
    }
  });

  // Alterações de Fullscreen
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      btnFullscreen.textContent = '🗗';
      btnFullscreen.setAttribute('aria-label', 'Sair de tela cheia');
      uiHideTimeout = setTimeout(hideUI, UI_HIDE_DELAY);
    } else {
      btnFullscreen.textContent = '⛶';
      btnFullscreen.setAttribute('aria-label', 'Tela cheia');
      clearTimeout(uiHideTimeout);
      showUI();
    }
  });
});
