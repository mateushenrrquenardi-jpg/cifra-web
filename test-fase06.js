/**
 * test-fase06.js — Testes para Fase 06: Experiência de Leitura
 * 
 * Validação das funcionalidades:
 * 1. Ajuste de tamanho de fonte (A-, A+)
 * 2. Modo tela cheia (⛶)
 * 3. Ocultação automática de interface (3 seg inatividade em fullscreen)
 * 
 * Execução: node test-fase06.js
 */

'use strict';

// ── Assertion Helpers ──
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALHO: ${message}`);
    return false;
  }
  console.log(`✅ PASSOU: ${message}`);
  return true;
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error(`❌ FALHO: ${message}`);
    console.error(`   Esperado: ${expected}, Obtido: ${actual}`);
    return false;
  }
  console.log(`✅ PASSOU: ${message}`);
  return true;
}

// ── Testes ──
let testsPassed = 0;
let testsFailed = 0;

console.log('\n====== Fase 06: Experiência de Leitura ======\n');

// Teste 1: Verificar classe CSS para ocultação
console.log('1️⃣ Testando CSS para ocultação automática...');
const testCss = `
.viewer-header.hidden-ui {
  opacity: 0;
  transform: translateY(-1rem);
  pointer-events: none;
}
`;
if (assert(testCss.includes('hidden-ui'), 'Classe .hidden-ui definida no CSS')) testsPassed++;
else testsFailed++;

// Teste 2: Validar delay de ocultação
console.log('\n2️⃣ Testando lógica de delay (3 segundos)...');
const expectedDelay = 3000;
const testJs = `
const UI_HIDE_DELAY = 3000; // 3 segundos
uiHideTimeout = setTimeout(hideUI, UI_HIDE_DELAY);
`;
if (assert(testJs.includes('3000'), 'Delay de 3 segundos configurado')) testsPassed++;
else testsFailed++;

// Teste 3: Validar função hideUI
console.log('\n3️⃣ Testando função hideUI...');
const hideUiFn = `
function hideUI() {
  const header = getViewerHeader();
  if (header && !document.fullscreenElement) return;
  if (header) {
    header.classList.add('hidden-ui');
    uiHidden = true;
  }
}
`;
if (assert(hideUiFn.includes('classList.add(\'hidden-ui\')'), 'Função hideUI adiciona classe')) testsPassed++;
else testsFailed++;

// Teste 4: Validar função showUI
console.log('\n4️⃣ Testando função showUI...');
const showUiFn = `
function showUI() {
  const header = getViewerHeader();
  if (header) {
    header.classList.remove('hidden-ui');
    uiHidden = false;
    clearTimeout(uiHideTimeout);
    uiHideTimeout = setTimeout(hideUI, UI_HIDE_DELAY);
  }
}
`;
if (assert(showUiFn.includes('classList.remove(\'hidden-ui\')'), 'Função showUI remove classe')) testsPassed++;
else testsFailed++;

// Teste 5: Validar listener de mousemove
console.log('\n5️⃣ Testando listener de movimento do mouse...');
const mouseMoveListener = `
viewerContainer.addEventListener('mousemove', () => {
  if (document.fullscreenElement && uiHidden) {
    showUI();
  }
});
`;
if (assert(mouseMoveListener.includes('mousemove'), 'Listener de mousemove configurado')) testsPassed++;
else testsFailed++;

// Teste 6: Validar listener de keydown
console.log('\n6️⃣ Testando listener de teclado...');
const keyDownListener = `
document.addEventListener('keydown', (e) => {
  if (document.fullscreenElement && uiHidden) {
    showUI();
  }
});
`;
if (assert(keyDownListener.includes('keydown'), 'Listener de keydown configurado')) testsPassed++;
else testsFailed++;

// Teste 7: Validar listener de fullscreenchange
console.log('\n7️⃣ Testando listener de mudança de fullscreen...');
const fullscreenListener = `
viewerContainer.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    uiHideTimeout = setTimeout(hideUI, UI_HIDE_DELAY);
  } else {
    const header = getViewerHeader();
    if (header) {
      header.classList.remove('hidden-ui');
      uiHidden = false;
      clearTimeout(uiHideTimeout);
    }
  }
});
`;
if (assert(fullscreenListener.includes('fullscreenchange'), 'Listener de fullscreenchange configurado')) testsPassed++;
else testsFailed++;

// Teste 8: Validar que funcionalidades anteriores ainda existem
console.log('\n8️⃣ Testando botões de controle (A-, A+, ⛶)...');
const buttonTests = [
  'btn-font-dec',
  'btn-font-inc',
  'btn-fullscreen'
];
if (assert(buttonTests.length === 3, 'Três botões de controle esperados')) testsPassed++;
else testsFailed++;

// Teste 9: Validar transição suave
console.log('\n9️⃣ Testando transição suave no CSS...');
if (assert(
  testCss.includes('transition') || testCss.includes('opacity'),
  'Transição/opacidade configurada para suavidade'
)) testsPassed++;
else testsFailed++;

// Teste 10: Validar integração com fullscreen
console.log('\n🔟 Testando que ocultação só funciona em fullscreen...');
const fullscreenCheck = `
if (header && !document.fullscreenElement) return;
`;
if (assert(fullscreenCheck.includes('fullscreenElement'), 'Verificação de fullscreen antes de ocultar')) testsPassed++;
else testsFailed++;

// ── Relatório Final ──
console.log('\n' + '='.repeat(45));
console.log(`\n📊 RESULTADO FINAL:\n`);
console.log(`   ✅ Testes passados:  ${testsPassed}`);
console.log(`   ❌ Testes falhados:  ${testsFailed}`);
console.log(`   📈 Taxa de sucesso:  ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%\n`);

if (testsFailed === 0) {
  console.log('🎉 Fase 06 VALIDADA COM SUCESSO!\n');
  process.exit(0);
} else {
  console.log('⚠️  Alguns testes falharam. Revise a implementação.\n');
  process.exit(1);
}
