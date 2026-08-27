# Processo de Desenvolvimento com IA — Cifra Web

## 1. Objetivo

Este documento define como utilizar diferentes IAs, em ferramentas diferentes e em dias diferentes, sem perder o contexto do projeto.

## 2. Regra principal

O Git é a memória do projeto.

A conversa com uma IA não deve ser considerada memória permanente.

As decisões importantes precisam existir em arquivos versionados.

## 3. Antes de começar uma tarefa

O agente deve ler:

```text
README.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/ROADMAP.md
docs/AI_CONTEXT.md
```

Depois deve verificar o estado atual do código.

## 4. Tarefas pequenas

Cada sessão com IA deve possuir um objetivo específico.

Exemplo bom:

> Implementar a pesquisa por nome de música usando os dados atuais do catálogo, sem modificar o formato dos arquivos `.md`.

Exemplo ruim:

> Melhorar o aplicativo.

## 5. Limites de alteração

A IA não deve alterar módulos não relacionados à tarefa.

Se encontrar um problema lateral, registrar o problema em vez de corrigi-lo automaticamente quando isso aumentar o escopo.

## 6. Não alterar arquitetura silenciosamente

Se uma implementação exigir uma nova decisão arquitetural:

1. identificar o conflito;
2. explicar a necessidade;
3. marcar a decisão como pendente;
4. não introduzir a mudança silenciosamente.

## 7. Teste após cada tarefa

Cada tarefa deve terminar com uma verificação funcional mínima.

Exemplo:

```text
Implementação
↓
Teste
↓
Correção
↓
Commit
```

## 8. Commit

Quando uma tarefa estiver concluída:

```bash
git status
git add .
git commit -m "feat: descrição curta"
git push
```

O texto exato do commit pode variar, mas deve explicar a unidade de mudança.

## 9. Troca de IA

Quando trocar de ferramenta:

A nova IA não deve depender de uma explicação manual completa do projeto.

Ela deve receber o repositório atualizado e ler a documentação.

## 10. Encerramento de sessão

Ao terminar uma tarefa importante, atualizar:

- `docs/ROADMAP.md`, quando o status de uma fase mudar;
- `docs/AI_CONTEXT.md`, quando uma regra permanente mudar;
- `docs/ARCHITECTURE.md`, quando uma decisão arquitetural mudar;
- `docs/DATA_MODEL.md`, quando o contrato dos arquivos mudar.

## 11. Revisão por segunda IA

Quando possível, uma segunda IA pode atuar como revisora.

Ela deve receber:

- arquitetura;
- requisito da tarefa;
- código implementado.

A revisão deve procurar:

- bugs;
- regressões;
- violações da arquitetura;
- complexidade desnecessária;
- problemas de responsividade;
- tratamento incorreto de arquivos e cifras.

## 12. Papel humano

A IA pode escrever grande parte do código, mas decisões de produto e arquitetura permanecem sob controle do proprietário do projeto.

O objetivo é reduzir o trabalho manual, não transformar o repositório em código que ninguém consiga compreender.
