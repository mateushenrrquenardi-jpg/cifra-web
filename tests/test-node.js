/**
 * Cifra Web — Runner de Testes em Linha de Comando (Node.js)
 */

import { runTests } from './test-suite.js';

console.log('====================================================');
console.log(' Executando Testes Automatizados — Cifra Web (Fase 03)');
console.log('====================================================\n');

const results = runTests();
let passed = 0;
let failed = 0;

results.forEach((r, idx) => {
  const status = r.passed ? '✓ PASSOU' : '✗ FALHOU';
  console.log(`[${idx + 1}/${results.length}] ${status}: ${r.name}`);
  if (r.passed) {
    passed++;
  } else {
    failed++;
    if (r.details) console.log(`   Detalhes: ${JSON.stringify(r.details)}`);
  }
});

console.log('\n----------------------------------------------------');
console.log(` Resultado Final: ${passed}/${results.length} testes aprovados.`);
console.log('----------------------------------------------------');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✓ Todos os testes foram executados e aprovados com sucesso!');
  process.exit(0);
}
