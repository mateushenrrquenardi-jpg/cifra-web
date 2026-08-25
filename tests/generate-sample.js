import { parseSource } from '../js/modules/parser.js';
import { generateMarkdown } from '../js/modules/markdown-generator.js';
import { slugify, generateFilename } from '../js/modules/utils.js';
import fs from 'fs';
import path from 'path';

const raw = `Ele É Exaltado
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

const parsed = parseSource(raw);
parsed.category = 'Gospel';
parsed.tags = ['louvor', 'adoracao'];
parsed.author = 'Twila Paris / Versão: Adhemar de Campos';
parsed.createdAt = '2026-08-24';

const md = generateMarkdown(parsed);
const artistSlug = slugify(parsed.artist);
const songSlug = generateFilename(parsed.title);

const targetDir = path.resolve('../cifra-catalogo/musicas', artistSlug);
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const targetFile = path.join(targetDir, songSlug);
fs.writeFileSync(targetFile, md, 'utf-8');

console.log('Arquivo gerado com sucesso em:', targetFile);
console.log('Conteúdo:\n' + md);
