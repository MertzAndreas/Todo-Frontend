import {BASE_URL} from "@/utils/globals";

export async function fetchNewToken() {
    const response = await fetch(`${BASE_URL}/Account/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to refresh token");
    }
    return data.accessToken;
};