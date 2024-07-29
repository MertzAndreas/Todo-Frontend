import {RegisterForm} from "@/app/Account/Register/page";
import {BASE_URL} from "@/utils/globals";

export async function registerRequest(form: RegisterForm) {
    const res = await fetch(`${BASE_URL}/Account/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
    }

    return await res.json();
}