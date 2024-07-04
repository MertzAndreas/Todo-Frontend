import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenExpired } from '@/app/utils/isTokenExpired';

export const useToken = (failRouterUrl? : string, sucessRouterUrl? : string) => {
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
            if(data.errorCode === "INVALID_TOKEN")
                throw new Error(data.message || 'Invalid refresh failed');
            if(failRouterUrl){
                router.push(failRouterUrl);
            }

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
        if (token && !isTokenExpired(token) && sucessRouterUrl) {
            router.push(sucessRouterUrl);
        } else {
            await refreshAccessToken();
        }
    }, [handleToken, refreshAccessToken, router]);

    return { refreshAccessToken, handleToken, validateToken };
};
