import { BASE_URL } from '@/utils/globals';

export async function logoutRequest(token: string) {
    const res = await fetch(`${BASE_URL}/Account/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Logout failed');
    }

    return await res.json();
}
