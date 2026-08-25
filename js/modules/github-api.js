/**
 * Cifra Web — Módulo de Integração com GitHub API
 * Fase 04: Publicação Direta de Cifras
 * 
 * Permite publicar arquivos .md diretamente no repositório cifra-catalogo
 * via REST API do GitHub, usando um Personal Access Token (PAT) do usuário.
 * 
 * Regras: Vanilla JS puro, sem backend, sem dependências.
 * Toda comunicação ocorre diretamente do navegador.
 */

'use strict';

const GITHUB_OWNER = 'mateushenrrquenardi-jpg';
const GITHUB_REPO = 'cifra-catalogo';
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
const TOKEN_STORAGE_KEY = 'cifra-web-github-pat';

/**
 * Salva o token no localStorage.
 * @param {string} token
 */
export function saveToken(token) {
  if (token && token.trim()) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
  }
}

/**
 * Recupera o token do localStorage.
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Remove o token do localStorage.
 */
export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Verifica se o token é válido fazendo uma chamada autenticada simples.
 * @param {string} token
 * @returns {Promise<{ valid: boolean, user: string|null }>}
 */
export async function verifyToken(token) {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { valid: true, user: data.login };
    }
    return { valid: false, user: null };
  } catch (error) {
    console.error('[Cifra Web] Erro ao verificar token:', error);
    return { valid: false, user: null };
  }
}

/**
 * Verifica se um arquivo já existe no repositório e retorna o SHA se existir.
 * @param {string} filePath — Caminho no repositório (ex: "musicas/adhemar-de-campos/ele-e-exaltado.md")
 * @param {string} token
 * @returns {Promise<string|null>} — SHA do arquivo existente ou null
 */
async function getFileSHA(filePath, token) {
  try {
    const response = await fetch(`${API_BASE}/contents/${filePath}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.sha;
    }
    return null; // Arquivo não existe (404)
  } catch {
    return null;
  }
}

/**
 * Publica (cria ou atualiza) um arquivo Markdown no repositório cifra-catalogo.
 * 
 * @param {object} options
 * @param {string} options.artistSlug — Slug do artista (ex: "adhemar-de-campos")
 * @param {string} options.filename — Nome do arquivo (ex: "ele-e-exaltado.md")
 * @param {string} options.content — Conteúdo completo do Markdown
 * @param {string} options.commitMessage — Mensagem de commit
 * @param {string} [options.token] — Token PAT (se não informado, busca do localStorage)
 * @returns {Promise<{ success: boolean, message: string, url?: string }>}
 */
export async function publishToCatalog({ artistSlug, filename, content, commitMessage, token }) {
  const pat = token || getToken();

  if (!pat) {
    return {
      success: false,
      message: 'Token de acesso não configurado. Configure seu GitHub Personal Access Token nas configurações.'
    };
  }

  const filePath = `musicas/${artistSlug}/${filename}`;

  try {
    // 1. Verificar se o arquivo já existe (para obter SHA de atualização)
    const existingSHA = await getFileSHA(filePath, pat);

    // 2. Codificar conteúdo em Base64
    const contentBase64 = btoa(unescape(encodeURIComponent(content)));

    // 3. Montar corpo da requisição
    const body = {
      message: commitMessage || `Adicionar cifra: ${filename}`,
      content: contentBase64,
      branch: 'main'
    };

    // Se o arquivo já existe, incluir o SHA para atualização
    if (existingSHA) {
      body.sha = existingSHA;
    }

    // 4. Fazer PUT para criar ou atualizar o arquivo
    const response = await fetch(`${API_BASE}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.ok || response.status === 201) {
      const data = await response.json();
      const action = existingSHA ? 'atualizada' : 'publicada';
      return {
        success: true,
        message: `Cifra ${action} com sucesso em "${filePath}"!`,
        url: data.content?.html_url || `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/main/${filePath}`
      };
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.message || `Erro HTTP ${response.status}`;
    return {
      success: false,
      message: `Erro ao publicar: ${errorMsg}`
    };
  } catch (error) {
    console.error('[Cifra Web] Erro ao publicar no catálogo:', error);
    return {
      success: false,
      message: `Erro de rede ao publicar: ${error.message}`
    };
  }
}
