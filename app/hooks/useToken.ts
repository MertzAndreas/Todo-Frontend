import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenExpired } from '@/app/utils/isTokenExpired';

export const useToken = () => {
    const router = useRouter();

    const refreshAccessToken = useCallback(async () => {
        const response = await fetch('http://localhost:5040/Account/refresh-token', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            const newToken = data.accessToken;
            localStorage.setItem('token', newToken);
            return newToken;
        } else {
            router.push('/Account/Login');
            if(data.errorCode === "INVALID_TOKEN")
                throw new Error(data.message || 'Invalid refresh failed');
        }
    }, [router]);

    const handleToken = useCallback(async (token: string): Promise<string> => {
        if (isTokenExpired(token)) {
            return await refreshAccessToken();
        }
        return token;
    }, [refreshAccessToken]);

    const validateToken = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            router.push('/chat');
        } else {
            await refreshAccessToken();
        }
    }, [handleToken, refreshAccessToken, router]);

    return { refreshAccessToken, handleToken, validateToken };
};
