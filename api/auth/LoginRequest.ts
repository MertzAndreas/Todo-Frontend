import { LoginFormValues } from '@/app/Account/Login/page';
import { BASE_URL } from '@/utils/globals';

export async function loginRequest(form: LoginFormValues) {
    const res = await fetch(`${BASE_URL}/Account/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
    }

    return await res.json();
}
