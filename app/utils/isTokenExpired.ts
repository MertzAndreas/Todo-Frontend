interface DecodedToken {
    exp: number;
    iss: string;
    jti: string,
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    aud: string,
}

export const getUserIdFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const decodedToken: DecodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    }
    catch (error) {
        return null;
    }

}

export const isTokenExpired = (token: string) => {
    try {
        const decodedToken: DecodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log(decodedToken);
        const expiration = decodedToken.exp;
        const currentTimestamp = Math.floor(new Date().getTime() / 1000);
        return currentTimestamp > expiration;
    }
    catch (error) {
        return true;
    }
};