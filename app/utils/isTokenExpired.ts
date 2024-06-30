interface DecodedToken {
    exp: number;
    iss: string;
    jti: string,
    aud: string,
}

export const isTokenExpired = (token: string) => {
    try {
        const decodedToken: DecodedToken = JSON.parse(atob(token.split('.')[1]));
        const expiration = decodedToken.exp;
        const currentTimestamp = Math.floor(new Date().getTime() / 1000);
        return currentTimestamp > expiration;
    }
    catch (error) {
        return true;
    }
};