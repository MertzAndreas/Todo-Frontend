import {RegisterForm} from "@/app/Account/Register/page";

export const register = async (form : RegisterForm) => {

    const {confirmPassword, ...newForm} = form;

    const res = await fetch('http://localhost:5040/Account/register', {
        method: 'POST',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newForm)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
    }
    return await res.json().then(data => data)
}