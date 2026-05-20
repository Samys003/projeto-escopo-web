import { API_URL, getAuthHeaders, parseResponse } from '../../../services/api';

export async function getDashboard() {
    const response = await fetch(`${API_URL}/api/v1/dashboard/`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}

export async function answerInvite(conviteId, conviteStatusId) {
    const response = await fetch(`${API_URL}/api/v1/convite/${conviteId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ novo_status_id: conviteStatusId }),
    });
    return parseResponse(response);
}
