'use client';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    getTokenFromStorage,
    isTokenExpired,
    removeTokenFromStorage,
    setTokenInStorage,
} from '@/utils/token';
import { useRouter } from 'next/navigation';
import { LoginFormValues } from '@/app/Account/Login/page';
import { loginRequest } from '@/api/auth/LoginRequest';
import { registerRequest } from '@/api/auth/RegisterRequest';
import { fetchNewToken } from '@/api/auth/FetchNewToken';
import { logoutRequest } from '@/api/auth/logoutRequest';
import { RegisterFormValues } from '@/app/Account/Register/registerFormSchema';

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const isProcessing = useRef(false);

    const refreshAccessToken = useCallback(async () => {
        try {
            if (isProcessing.current) return;
            isProcessing.current = true;
            const newToken = await fetchNewToken();
            setTokenInStorage(newToken);
            setIsAuthenticated(true);
            return newToken;
        } catch (error) {
            removeTokenFromStorage();
            setIsAuthenticated(false);
            throw new Error('Failed to refresh token');
        } finally {
            isProcessing.current = false;
        }
    }, []);

    async function login(form: LoginFormValues) {
        const data = await loginRequest(form);
        setTokenInStorage(data.accessToken);
        setIsAuthenticated(true);
        router.push('/Dashboard');
    }

    async function register(form: RegisterFormValues) {
        const data = await registerRequest(form);
        setTokenInStorage(data.accessToken);
        setIsAuthenticated(true);
        router.push('/Dashboard');
    }

    async function logOut() {
        setIsAuthenticated(false);
        const token = await getToken();
        removeTokenFromStorage();
        await logoutRequest(token);
        router.push('/Account/Login');
    }

    const getToken = useCallback(async () => {
        try {
            const storedToken = getTokenFromStorage();
            if (storedToken && !isTokenExpired(storedToken)) {
                return storedToken;
            }
            return await refreshAccessToken();
        } catch (error) {
            console.error('Error getting token:', error);
        }
    }, [refreshAccessToken]);

    const initializeAuthState = useCallback(async () => {
        try {
            const storedToken = getTokenFromStorage();
            if (storedToken && !isTokenExpired(storedToken)) {
                setIsAuthenticated(true);
                return;
            }
            const refreshedToken = await refreshAccessToken();
            if (refreshedToken) {
                setIsAuthenticated(true);
                return;
            }
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error initializing authentication state:', error);
            setIsAuthenticated(false);
        }
    }, [refreshAccessToken]);

    useEffect(() => {
        if (isAuthenticated === null) {
            initializeAuthState();
        }
    }, [isAuthenticated, initializeAuthState]);

    const redirectToDashboardIfAuthenticated = useCallback(() => {
        if (isAuthenticated === true) {
            router.push('/Dashboard');
        }
    }, [isAuthenticated, router]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                getToken,
                login,
                logOut,
                register,
                redirectToDashboardIfAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

interface AuthContextType {
    isAuthenticated: boolean | null;
    getToken: () => Promise<string>;
    login: (form: LoginFormValues) => Promise<void>;
    logOut: () => void;
    register: (form: RegisterForm) => Promise<void>;
    redirectToDashboardIfAuthenticated: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

export default useAuthContext;
