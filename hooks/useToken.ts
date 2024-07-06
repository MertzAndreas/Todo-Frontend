import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenExpired } from '@/utils/isTokenExpired';


const fetchNewToken = async () => {
    const response = await fetch(`http://localhost:5040/Account/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh token');
    }
    return data.accessToken;
};

export const useToken = (failRouterUrl?: string, successRouterUrl?: string) => {
    const router = useRouter();

    const handleNavigation = useCallback((url?: string) => {
        if (url) {
            router.push(url);
        }
    }, [router]);

    const refreshAccessToken = useCallback(async () => {
        let newToken;
        try {
            newToken = await fetchNewToken();
            localStorage.setItem('token', newToken);
            handleNavigation(successRouterUrl);
            return newToken;
            }
        catch (error) {
            localStorage.removeItem('token')
            handleNavigation(failRouterUrl);
        }
    }, [failRouterUrl, successRouterUrl, handleNavigation]);

    const validateAndRefreshToken = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (token && !isTokenExpired(token)) {
                handleNavigation(successRouterUrl);
            } else {
                await refreshAccessToken();
            }
        } catch (error) {
            console.error('Error validating token:', error);
            throw error;
        }
    }, [refreshAccessToken, handleNavigation, successRouterUrl]);

    const getToken = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (token && !isTokenExpired(token)) {
                return token;
            }
            return await refreshAccessToken();
        } catch (error) {
            console.error('Error getting token:', error);
            throw error;
        }
    }, [refreshAccessToken]);

    return { validateAndRefreshToken, getToken };
};
