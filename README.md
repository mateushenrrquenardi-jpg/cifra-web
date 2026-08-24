# Cifra Web — Aplicação

Aplicação web minimalista para consulta e visualização de cifras musicais.

Construída exclusivamente com **HTML5**, **CSS3** e **JavaScript puro**, hospedada no **GitHub Pages**.

## Estrutura do Repositório

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml   # Deploy automatizado no GitHub Pages
├── .gitignore
├── README.md
├── index.html           # Página inicial da aplicação
├── css/
│   └── style.css        # Folha de estilos responsiva
├── js/
│   └── app.js           # Lógica cliente em Vanilla JS
└── assets/              # Recursos estáticos (ícones, imagens)
```

## Como Executar Localmente

Não requer instalação de dependências, npm ou bundlers.

Basta abrir o arquivo `index.html` em qualquer navegador web moderno ou utilizar um servidor estático local (como Python `python -m http.server` ou a extensão Live Server).

## Publicação no GitHub Pages

Este repositório está configurado para deploy automatizado através do GitHub Actions:
1. No repositório no GitHub, vá em **Settings** > **Pages**.
2. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
3. A cada push na branch `main`, a publicação será realizada automaticamente.
