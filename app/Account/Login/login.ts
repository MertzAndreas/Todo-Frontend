import {LoginForm} from "@/app/Account/Login/page";

export const login = async (form : LoginForm) => {
    const res = await fetch("http://localhost:5040/Account/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
    }

    return await res.json().then(data => data);
};