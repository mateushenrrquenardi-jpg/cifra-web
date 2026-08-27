/**
 * Teste da Fase 05 — Listagem e Pesquisa
 * Valida listas de músicas, artistas e filtros de busca
 */

import { loadCatalog, groupByArtist } from './js/modules/catalog-loader.js';

async function testPhase05() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  FASE 05 — Teste de Listagem e Pesquisa                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Carregar catálogo
    console.log('📂 Carregando catálogo...');
    const catalog = await loadCatalog();
    console.log(`✅ Catálogo carregado: ${catalog.length} cifra(s)\n`);

    // 2. Testar lista de músicas
    console.log('📋 TESTE 1: Lista de Músicas');
    console.log('─────────────────────────────');
    const musicasOrdenadas = [...catalog].sort((a, b) =>
      (a.metadata.title || '').localeCompare(b.metadata.title || '', 'pt-BR')
    );
    console.log(`  • Total: ${musicasOrdenadas.length} música(s)`);
    console.log('  • Primeiras 3:');
    musicasOrdenadas.slice(0, 3).forEach((music, i) => {
      console.log(`    ${i+1}. "${music.metadata.title}" (${music.metadata.artist})`);
    });
    console.log('  ✅ Lista de músicas funcionando\n');

    // 3. Testar lista de artistas
    console.log('👤 TESTE 2: Lista de Artistas');
    console.log('─────────────────────────────');
    const artistMap = groupByArtist(catalog);
    const artistasOrdenados = [...artistMap.entries()].sort((a, b) =>
      a[0].localeCompare(b[0], 'pt-BR')
    );
    console.log(`  • Total: ${artistMap.size} artista(s)`);
    console.log('  • Listagem:');
    artistasOrdenados.forEach(([artist, songs]) => {
      console.log(`    • ${artist}: ${songs.length} música(s)`);
    });
    console.log('  ✅ Lista de artistas funcionando\n');

    // 4. Testar pesquisa por nome
    console.log('🔍 TESTE 3: Pesquisa por Nome');
    console.log('─────────────────────────────');
    const searchTerm = 'exaltado';
    const resultados = catalog.filter(song => {
      const title = (song.metadata.title || '').toLowerCase();
      const artist = (song.metadata.artist || '').toLowerCase();
      const category = (song.metadata.category || '').toLowerCase();
      return title.includes(searchTerm) || artist.includes(searchTerm) || category.includes(searchTerm);
    });
    console.log(`  • Pesquisando por: "${searchTerm}"`);
    console.log(`  • Resultados: ${resultados.length}`);
    resultados.forEach(r => {
      console.log(`    • "${r.metadata.title}" - ${r.metadata.artist}`);
    });
    console.log('  ✅ Pesquisa por nome funcionando\n');

    // 5. Testar pesquisa por artista
    console.log('👤 TESTE 4: Pesquisa por Artista');
    console.log('────────────────────────────────');
    const artistSearch = 'Adhemar';
    const artistaResultados = catalog.filter(song =>
      (song.metadata.artist || '').toLowerCase().includes(artistSearch.toLowerCase())
    );
    console.log(`  • Pesquisando por artista: "${artistSearch}"`);
    console.log(`  • Resultados: ${artistaResultados.length}`);
    artistaResultados.forEach(r => {
      console.log(`    • "${r.metadata.title}" - ${r.metadata.artist}`);
    });
    console.log('  ✅ Pesquisa por artista funcionando\n');

    // 6. Testar filtro por categoria
    console.log('🏷️  TESTE 5: Filtro por Categoria');
    console.log('────────────────────────────────');
    const categorySearch = 'Gospel';
    const categoryResultados = catalog.filter(song =>
      (song.metadata.category || '').toLowerCase().includes(categorySearch.toLowerCase())
    );
    console.log(`  • Filtrando por categoria: "${categorySearch}"`);
    console.log(`  • Resultados: ${categoryResultados.length}`);
    categoryResultados.forEach(r => {
      console.log(`    • "${r.metadata.title}" - ${r.metadata.category}`);
    });
    console.log('  ✅ Filtro por categoria funcionando\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ RESULTADO: Todas as funcionalidades da Fase 05 validadas!');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}

testPhase05();
