import { API_URL, getAuthHeaders, parseResponse } from '../../../services/api';

export async function createProject({ titulo, descricao, integrantes }) {
    const response = await fetch(`${API_URL}/api/v1/projeto`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ titulo, descricao, integrantes }),
    });
    return parseResponse(response);
}

export async function updateProject({ titulo, descricao, integrantes, projetoId }) {
    const response = await fetch(`${API_URL}/api/v1/projeto/${projetoId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ titulo, descricao, integrantes }),
    });
    return parseResponse(response);
}

export async function getProjectMembers(projetoId) {
    const response = await fetch(`${API_URL}/api/v1/projeto/${projetoId}/participantes`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function getProjectById(id) {
    const response = await fetch(`${API_URL}/api/v1/projeto/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}
