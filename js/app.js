/**
 * Cifra Web — Aplicação Principal
 * Fase 05: Listagem e Pesquisa
 * 
 * Regras: Vanilla JavaScript puro, sem dependências ou frameworks.
 */

'use strict';

import { loadCatalog, groupByArtist } from './modules/catalog-loader.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Cifra Web] Aplicação inicializada — Fase 05: Listagem & Pesquisa.');

  // Elementos principais da interface
  const searchInput = document.getElementById('search-input');
  const btnSearch = document.getElementById('btn-search');
  const musicasPlaceholder = document.getElementById('musicas-placeholder');
  const artistasPlaceholder = document.getElementById('artistas-placeholder');
  const listaMusicas = document.getElementById('lista-musicas');
  const listaArtistas = document.getElementById('lista-artistas');
  const countMusicas = document.getElementById('count-musicas');
  const countArtistas = document.getElementById('count-artistas');

  // Estado da aplicação
  let catalogData = [];

  /**
   * Renderiza a lista de músicas no DOM
   * @param {Array} songs — Array de cifras com metadata
   */
  function renderMusicList(songs) {
    if (!listaMusicas) return;

    listaMusicas.innerHTML = '';

    if (songs.length === 0) {
      musicasPlaceholder.hidden = false;
      listaMusicas.hidden = true;
      countMusicas.textContent = '0 músicas';
      return;
    }

    // Ordenar por título
    const sorted = [...songs].sort((a, b) =>
      (a.metadata.title || '').localeCompare(b.metadata.title || '', 'pt-BR')
    );

    sorted.forEach(song => {
      const li = document.createElement('li');
      li.className = 'item-list-entry';
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      li.setAttribute('data-path', song.path);

      const title = song.metadata.title || 'Sem título';
      const artist = song.metadata.artist || 'Desconhecido';
      const key = song.metadata.original_key || '';

      li.innerHTML = `
        <div class="item-main">
          <span class="item-icon" aria-hidden="true">🎵</span>
          <div class="item-info">
            <span class="item-title">${escapeHtml(title)}</span>
            <span class="item-subtitle">${escapeHtml(artist)}</span>
          </div>
        </div>
        <div class="item-meta">
          ${key ? `<span class="item-key" title="Tom: ${escapeHtml(key)}">${escapeHtml(key)}</span>` : ''}
        </div>
      `;

      // Evento para abrir a cifra em uma página diferente
      const openAction = () => {
        window.location.href = `cifra.html?path=${encodeURIComponent(song.path)}`;
      };

      li.addEventListener('click', openAction);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAction();
        }
      });

      listaMusicas.appendChild(li);
    });

    musicasPlaceholder.hidden = true;
    listaMusicas.hidden = false;
    countMusicas.textContent = `${songs.length} música${songs.length !== 1 ? 's' : ''}`;
  }

  /**
   * Renderiza a lista de artistas no DOM
   * @param {Map<string, Array>} artistMap
   */
  function renderArtistList(artistMap) {
    if (!listaArtistas) return;

    listaArtistas.innerHTML = '';

    if (artistMap.size === 0) {
      artistasPlaceholder.hidden = false;
      listaArtistas.hidden = true;
      countArtistas.textContent = '0 artistas';
      return;
    }

    // Ordenar artistas alfabeticamente
    const sortedArtists = [...artistMap.entries()].sort((a, b) =>
      a[0].localeCompare(b[0], 'pt-BR')
    );

    sortedArtists.forEach(([artist, songs]) => {
      const li = document.createElement('li');
      li.className = 'item-list-entry';
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');

      li.innerHTML = `
        <div class="item-main">
          <span class="item-icon" aria-hidden="true">👤</span>
          <div class="item-info">
            <span class="item-title">${escapeHtml(artist)}</span>
            <span class="item-subtitle">${songs.length} música${songs.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      `;

      // Ao clicar no artista, filtra a lista de músicas
      li.addEventListener('click', () => {
        renderMusicList(songs);
        listaMusicas.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          renderMusicList(songs);
        }
      });

      listaArtistas.appendChild(li);
    });

    artistasPlaceholder.hidden = true;
    listaArtistas.hidden = false;
    countArtistas.textContent = `${artistMap.size} artista${artistMap.size !== 1 ? 's' : ''}`;
  }

  /**
   * Escape HTML para exibição segura
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Filtra a lista de músicas e artistas com base na consulta de busca
   * @param {string} query
   */
  function filterCatalog(query) {
    const q = query.toLowerCase().trim();

    if (!q) {
      renderMusicList(catalogData);
      renderArtistList(groupByArtist(catalogData));
      return;
    }

    const filtered = catalogData.filter(song => {
      const title = (song.metadata.title || '').toLowerCase();
      const artist = (song.metadata.artist || '').toLowerCase();
      const category = (song.metadata.category || '').toLowerCase();
      return title.includes(q) || artist.includes(q) || category.includes(q);
    });

    renderMusicList(filtered);
    renderArtistList(groupByArtist(filtered));
  }

  // ── Busca ──

  if (searchInput && btnSearch) {
    btnSearch.addEventListener('click', () => {
      filterCatalog(searchInput.value);
    });

    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        filterCatalog(searchInput.value);
      }
    });

    // Filtro em tempo real ao digitar (debounced)
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        filterCatalog(searchInput.value);
      }, 300);
    });
  }

  // ── Inicialização: Carregar Catálogo ──

  async function init() {
    if (musicasPlaceholder) {
      musicasPlaceholder.querySelector('.placeholder-title').textContent = 'Carregando catálogo...';
      musicasPlaceholder.querySelector('.placeholder-desc').textContent = 'Buscando músicas do repositório GitHub.';
    }

    try {
      catalogData = await loadCatalog();

      renderMusicList(catalogData);
      renderArtistList(groupByArtist(catalogData));

      if (catalogData.length === 0) {
        if (musicasPlaceholder) {
          musicasPlaceholder.querySelector('.placeholder-title').textContent = 'Catálogo vazio';
          musicasPlaceholder.querySelector('.placeholder-desc').textContent = 'Nenhuma cifra encontrada. Use o importador para adicionar a primeira!';
        }
      }
    } catch (error) {
      console.error('[Cifra Web] Erro ao carregar catálogo:', error);
      if (musicasPlaceholder) {
        musicasPlaceholder.querySelector('.placeholder-title').textContent = 'Erro ao carregar';
        musicasPlaceholder.querySelector('.placeholder-desc').textContent =
          'Não foi possível carregar o índice do catálogo. Verifique sua conexão e tente novamente.';
      }
      if (artistasPlaceholder) {
        artistasPlaceholder.querySelector('.placeholder-title').textContent = 'Erro ao carregar';
        artistasPlaceholder.querySelector('.placeholder-desc').textContent =
          'Não foi possível carregar o índice do catálogo.';
      }
    }
  }

  init();
});
