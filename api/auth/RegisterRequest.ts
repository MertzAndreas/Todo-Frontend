import { BASE_URL } from '@/utils/globals';
import { RegisterFormValues } from '@/app/Account/Register/registerFormSchema';

export async function registerRequest(form: RegisterFormValues) {
    const { confirmPassword, ...rest } = form;

    const res = await fetch(`${BASE_URL}/Account/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rest),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error[0]?.description || 'An unknown error occurred.');
    }

    return await res.json();
}
