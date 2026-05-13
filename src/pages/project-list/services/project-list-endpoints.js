import { API_URL, getAuthHeaders, parseResponse } from '../../../services/api';

export async function getProjects() {
    const response = await fetch(`${API_URL}/api/v1/projetos/`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}
