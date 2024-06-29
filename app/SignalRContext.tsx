"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface SignalRContextType {
    connection: HubConnection | null;
    startConnection: (token: string) => void;
    isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const useSignalR = (): SignalRContextType => {
    const context = useContext(SignalRContext);
    if (!context) {
        throw new Error('useSignalR must be used within a SignalRProvider');
    }
    return context;
};

interface SignalRProviderProps {
    children: ReactNode;
}

interface decodedToken {
    exp: number;
    iss: string;
    jti: string,
    aud: string,
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const isConnected = connection !== null;

    const isTokenExpired = (token: string) => {
        const decodedToken : decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expiration = decodedToken.exp;
        const currentTimestamp = Math.floor(new Date().getTime() / 1000);
        console.log(decodedToken)
        return currentTimestamp > expiration;

    }

    const refreshToken = async () => {
        const response = await fetch('http://localhost:5040/Account/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data.token;
    };


    const startConnection = (token: string) => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(`http://localhost:5040/hub`, {
                accessTokenFactory: async () => {
                    if(isTokenExpired(token)) {
                        const newToken = await refreshToken();
                        localStorage.setItem('token', newToken);
                        return newToken;
                    }
                    return token;
                }
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        newConnection.onclose((error) => {
            console.error("Connection closed due to error:", error);
            setConnection(null);
        });

        newConnection.onreconnecting((error) => {
            console.log("Connection lost due to error. Reconnecting.", error);
        });

        newConnection.onreconnected((connectionId) => {
            console.log("Reconnected. Connection ID:", connectionId);
        });

        setConnection(newConnection);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !connection) {
            console.log("Starting connection with token:", token)
            startConnection(token);
        }

        if (connection) {
            connection
                .start()
                .then(() => console.log('Connected to SignalR hub'))
                .catch(err => console.error('Error while starting connection: ' + err));
        }

        return () => {
            if (connection) {
                connection.stop();
        }
    };
}, [connection]);

    return (
        <SignalRContext.Provider value={{
            connection,
            startConnection,
            isConnected,
        }}>
            {children}
        </SignalRContext.Provider>
    );
};
