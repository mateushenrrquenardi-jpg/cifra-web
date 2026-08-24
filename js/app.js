/**
 * Cifra Web — Aplicação Principal
 * Fase 02: Fundação do projeto
 * 
 * Regras: Vanilla JavaScript puro, sem dependências ou frameworks.
 */

'use strict';

/**
 * Inicialização da aplicação após o carregamento completo do DOM.
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Cifra Web] Aplicação inicializada com sucesso — Fase 02: Fundação.');

  // Elementos principais da interface
  const searchInput = document.getElementById('search-input');
  const btnSearch = document.getElementById('btn-search');
  const musicasPlaceholder = document.getElementById('musicas-placeholder');
  const artistasPlaceholder = document.getElementById('artistas-placeholder');

  // Configuração básica do campo de busca visual (preparado para Fase 05)
  if (searchInput && btnSearch) {
    btnSearch.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        console.log(`[Cifra Web] Consulta registrada: "${query}" (busca funcional será integrada na Fase 05).`);
      }
    });

    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        btnSearch.click();
      }
    });
  }
});
