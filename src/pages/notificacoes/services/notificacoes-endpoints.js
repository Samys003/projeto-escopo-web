import { API_URL, getAuthHeaders, parseResponse } from '../../../services/api';

export async function getNotificacoes() {
    const response = await fetch(`${API_URL}/api/v1/notificacoes`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function abrirNotificacao(notificacaoId) {
    const response = await fetch(`${API_URL}/api/v1/notificacao/${notificacaoId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}
