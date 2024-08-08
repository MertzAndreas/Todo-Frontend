import { BASE_URL } from '@/utils/globals';

export async function LogoutRequest(token: string) {
    const res = await fetch(`${BASE_URL}/Account/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Logout failed for unknown reason');
    }
}
