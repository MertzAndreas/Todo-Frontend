import { BASE_URL } from '@/utils/globals';
import { LoginFormValues } from '@/app/Account/Login/loginFormSchema';

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
        const error = await res.text();
        throw new Error(error || 'Login failed due to unknown error');
    }

    return await res.json();
}
