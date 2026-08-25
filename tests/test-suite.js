/**
 * Cifra Web — Suíte de Testes Automatizados da Fase 03
 * Testa o parser, metadados, formatação, validação, slugify e gerador de markdown.
 */

'use strict';

import { parseSource } from '../js/modules/parser.js';
import { extractMetadata } from '../js/modules/metadata.js';
import { formatCifraBody, isChord, isChordLine, formatChordLine } from '../js/modules/formatter.js';
import { validateCifraData } from '../js/modules/validator.js';
import { generateMarkdown } from '../js/modules/markdown-generator.js';
import { slugify, generateFilename } from '../js/modules/utils.js';

export function runTests() {
  const results = [];

  function assert(name, condition, details = '') {
    if (condition) {
      results.push({ name, passed: true, details });
    } else {
      results.push({ name, passed: false, details });
      console.error(`[TEST FAILED] ${name}:`, details);
    }
  }

  // -------------------------------------------------------------
  // Teste 1: Reconhecimento de acordes (Simples, Baixo, Extensões)
  // -------------------------------------------------------------
  assert('Acordes simples válidos', isChord('C') && isChord('D') && isChord('G') && isChord('Am') && isChord('Bb'));
  assert('Acordes com baixo invertido válidos', isChord('E/G#') && isChord('A/C#') && isChord('B/D#') && isChord('G/B') && isChord('D/F#'));
  assert('Acordes com extensões complexas válidos', isChord('C#7(4/9)') && isChord('Em7') && isChord('F#m7') && isChord('Eb7M') && isChord('Asus4'));
  assert('Palavras comuns de letra NÃO são acordes', !isChord('exaltado') && !isChord('senhor') && !isChord('louvarei'));

  // -------------------------------------------------------------
  // Teste 2: Linhas somente com acordes vs Linhas de letra
  // -------------------------------------------------------------
  assert('Linha só com acordes detectada', isChordLine('C D Em7 D') && isChordLine('E/G#     A'));
  assert('Linha de letra NÃO tratada como linha de acordes', !isChordLine('Ele é exaltado') && !isChordLine('O rei é exaltado nos céus'));
  assert('Formatação de linha só de acordes com preservação de espaços', 
    formatChordLine('E/G#     A') === '[E/G#]     [A]'
  );

  // -------------------------------------------------------------
  // Teste 3: Normalização de Slug e Nome de Arquivo
  // -------------------------------------------------------------
  assert('Slugify de "Ele É Exaltado"', slugify('Ele É Exaltado') === 'ele-e-exaltado');
  assert('Slugify com acentos complexos "Não Tenho Medo"', slugify('Não Tenho Medo') === 'nao-tenho-medo');
  assert('Geração de nome de arquivo', generateFilename('Ele É Exaltado') === 'ele-e-exaltado.md');

  // -------------------------------------------------------------
  // Teste 4: Validador de Metadados
  // -------------------------------------------------------------
  const validData = {
    title: 'Ele É Exaltado',
    artist: 'Adhemar de Campos',
    category: 'Gospel',
    createdAt: '2026-08-24',
    originalKey: 'E',
    body: '[E]\nEle é exaltado'
  };
  assert('Validação de dados válidos passa', validateCifraData(validData).isValid);

  const missingKeyData = { ...validData, originalKey: '' };
  const missingKeyValidation = validateCifraData(missingKeyData);
  assert('Validação reprova tom ausente', !missingKeyValidation.isValid && missingKeyValidation.errors.some(e => e.includes('Tom')));

  const missingTitleData = { ...validData, title: '' };
  assert('Validação reprova título ausente', !validateCifraData(missingTitleData).isValid);

  // -------------------------------------------------------------
  // Teste 5: Gerador de Markdown com YAML Frontmatter
  // -------------------------------------------------------------
  const generatedMd = generateMarkdown({
    title: 'Ele É Exaltado',
    artist: 'Adhemar de Campos',
    category: 'Gospel',
    tags: ['louvor', 'adoracao'],
    author: 'Twila Paris',
    createdAt: '2026-08-24',
    originalKey: 'E',
    body: '[E]\nEle é exaltado'
  });
  assert('Markdown contém Frontmatter title', generatedMd.includes('title: Ele É Exaltado'));
  assert('Markdown contém Frontmatter artist', generatedMd.includes('artist: Adhemar de Campos'));
  assert('Markdown contém Frontmatter original_key', generatedMd.includes('original_key: E'));
  assert('Markdown contém Frontmatter author', generatedMd.includes('author: Twila Paris'));
  assert('Markdown contém Frontmatter tags formatadas', generatedMd.includes('tags:\n  - louvor\n  - adoracao'));
  assert('Markdown contém corpo da cifra', generatedMd.includes('[E]\nEle é exaltado'));

  // -------------------------------------------------------------
  // Teste 6: CASO DE TESTE PRINCIPAL — "Ele É Exaltado"
  // -------------------------------------------------------------
  const sampleInput = `Ele É Exaltado
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

  const parsedPrincipal = parseSource(sampleInput);

  assert('Caso Principal: Título detectado', parsedPrincipal.title === 'Ele É Exaltado');
  assert('Caso Principal: Artista detectado', parsedPrincipal.artist === 'Adhemar de Campos');
  assert('Caso Principal: Tom E detectado', parsedPrincipal.originalKey === 'E');
  assert('Caso Principal: Marcador [Intro] removido do corpo', !parsedPrincipal.body.includes('[Intro]'));
  assert('Caso Principal: Marcador [Primeira Parte] removido', !parsedPrincipal.body.includes('[Primeira Parte]'));
  assert('Caso Principal: Intro convertida em acordes', parsedPrincipal.body.includes('[C] [D] [Em7] [D]'));
  assert('Caso Principal: Acorde simples [E] reconhecido', parsedPrincipal.body.includes('[E]'));
  assert('Caso Principal: Acorde invertido [E/G#] e [A] com espaços', parsedPrincipal.body.includes('[E/G#]     [A]'));
  assert('Caso Principal: Acordes complexos [A/C#] [B/D#] [C#7(4/9)]', parsedPrincipal.body.includes('[A/C#] [B/D#] [C#7(4/9)]'));
  assert('Caso Principal: Letra "Ele é exaltado" preservada intacta', parsedPrincipal.body.includes('Ele é exaltado'));
  assert('Caso Principal: Letra "O rei é exaltado nos céus" preservada', parsedPrincipal.body.includes('O rei é exaltado nos céus'));
  assert('Caso Principal: Letra "Seu no - me  louvarei" preservada', parsedPrincipal.body.includes('Seu no - me  louvarei'));

  // -------------------------------------------------------------
  // Teste 7: Acordes em Negrito e Marcadores Adicionais ([Refrão], [Solo], [Final])
  // -------------------------------------------------------------
  const boldInput = `# Quão Grande É o Meu Deus
Soraya Moraes
Tom: G

[Intro] **G**  **Em**  **C**  **D**

[Refrão]
**G**
Quão grande é o meu Deus
**Em**
Cantarei quão grande é o meu Deus
**C**               **D**          **G**
E todos hão de ver quão grande é o meu Deus

[Final]
**G**`;

  const parsedBold = parseSource(boldInput);
  assert('Teste Negrito: Título detectado com #', parsedBold.title === 'Quão Grande É o Meu Deus');
  assert('Teste Negrito: Artista detectado', parsedBold.artist === 'Soraya Moraes');
  assert('Teste Negrito: Tom G detectado', parsedBold.originalKey === 'G');
  assert('Teste Negrito: Marcador [Refrão] removido', !parsedBold.body.includes('[Refrão]'));
  assert('Teste Negrito: Marcador [Final] removido', !parsedBold.body.includes('[Final]'));
  assert('Teste Negrito: Acordes em negrito convertidos para [G], [Em]', parsedBold.body.includes('[G]\nQuão grande é o meu Deus'));
  assert('Teste Negrito: Letras com acentos preservadas (Quão, é, hão)', parsedBold.body.includes('E todos hão de ver quão grande é o meu Deus'));

  return results;
}
