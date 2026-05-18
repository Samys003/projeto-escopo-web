import { API_URL, getAuthHeaders, parseResponse } from '../../../services/api';

export async function getDashboard() {
    const response = await fetch(`${API_URL}/api/v1/dashboard/`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseResponse(response);
}
