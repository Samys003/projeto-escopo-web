export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
        if (data?.mensagem) {
            throw new Error(data.mensagem);
        }
        if (data?.error) {
            throw new Error(data.error);
        }
        throw new Error(response.statusText || 'Erro na requisição.');
    }

    return data;
}

export async function login({ email, senha }) {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    });
    return parseResponse(response);
}

export async function register({ nome, email, senha }) {
    const response = await fetch(`${API_URL}/api/v1/auth/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
    });
    return parseResponse(response);
}

export function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export async function updateUserName({ nome }) {
    const response = await fetch(`${API_URL}/api/v1/usuario/nome`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nome }),
    });
    return parseResponse(response);
}

export async function updateUserProfilePicture({ foto_perfil }) {
    const response = await fetch(`${API_URL}/api/v1/usuario/foto-perfil`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ foto_perfil }),
    });
    return parseResponse(response);
}

export async function deleteUserAccount() {
    const response = await fetch(`${API_URL}/api/v1/usuario`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function getUserByEmail(email) {
    const response = await fetch(`${API_URL}/api/v1/usuario/email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function updatePassword({ senha_atual, senha_nova }) {
    const response = await fetch(`${API_URL}/api/v1/usuario/senha`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ senha_atual, senha_nova }),
    });
    return parseResponse(response);
}

export async function updateDocumentTitle({ documento_id, titulo }) {
    const response = await fetch(`${API_URL}/api/v1/documento/${documento_id}/titulo`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ titulo }),
    });
    return parseResponse(response);
}

export async function getDocumentById(documento_id) {
    const response = await fetch(`${API_URL}/api/v1/documento/${documento_id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function deleteDocument(documento_id) {
    const response = await fetch(`${API_URL}/api/v1/documento/${documento_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function createDocumentVersion({ documento_id, conteudo }) {
    const response = await fetch(`${API_URL}/api/v1/documento/${documento_id}/conteudo`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ conteudo }),
    });
    return parseResponse(response);
}

export async function getDocumentVersions(documento_id) {
    const response = await fetch(`${API_URL}/api/v1/documento/${documento_id}/versoes`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function getDocumentVersionById(documento_versao_id) {
    const response = await fetch(`${API_URL}/api/v1/documento/versao/${documento_versao_id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function getDocumentComments(documento_id) {
    const response = await fetch(`${API_URL}/api/v1/documento/${documento_id}/comentarios`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function createDocumentComment({
    documento_id,
    conteudo,
    parent_id = null,
    registro_referencia_id = null,
    comentario_tipo_id = 1,
}) {
    const response = await fetch(`${API_URL}/api/v1/documento/${documento_id}/comentario`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            conteudo,
            parent_id,
            registro_referencia_id,
            comentario_tipo_id,
        }),
    });
    return parseResponse(response);
}
