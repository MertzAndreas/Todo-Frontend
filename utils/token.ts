interface DecodedToken {
    exp: number;
    iss: string;
    jti: string;
    username: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
    aud: string;
}

const TOKEN_KEY = 'token';

export const isTokenExpired = (token: string) => {
    try {
        const decodedToken: DecodedToken = JSON.parse(atob(token.split('.')[1]));
        const expiration = decodedToken.exp;
        const currentTimestamp = Math.floor(new Date().getTime() / 1000);
        return currentTimestamp > expiration;
    } catch (error) {
        return true;
    }
};
export const getTokenFromStorage = () => localStorage.getItem(TOKEN_KEY);

export const setTokenInStorage = (token: string) => localStorage.setItem(TOKEN_KEY, token);

export const removeTokenFromStorage = () => localStorage.removeItem(TOKEN_KEY);

export const getUserNameFromToken = () => {
    const token = getTokenFromStorage();
    if (!token) return '';
    const decodedToken: DecodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.username;
};
export const isTokenValid = (token: string | null) => {
    return token && !isTokenExpired(token);
};
