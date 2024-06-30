import { useState, useEffect, useRef } from 'react';
import {
    HubConnectionBuilder,
    HubConnection,
    HubConnectionState,
    LogLevel,
} from '@microsoft/signalr';
import { useToken } from '@/app/hooks/useToken';

export const useSignalR = (hubUrl?: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const { handleToken } = useToken();

    const connectionRef = useRef<HubConnection | null>(null);

    useEffect(() => {
        const initializeConnection = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token available');
                }

                const validToken = await handleToken(token);

                const newConnection = new HubConnectionBuilder()
                    .withUrl(hubUrl || `http://localhost:5040/hub`, {
                        accessTokenFactory: () => validToken,
                    })
                    .withAutomaticReconnect()
                    .configureLogging(LogLevel.Information)
                    .build();

                connectionRef.current = newConnection;

                newConnection.onreconnecting((error) => {
                    console.log('Connection lost due to error. Reconnecting.', error);
                });

                newConnection.onreconnected((connectionId) => {
                    console.log('Reconnected. Connection ID:', connectionId);
                });

                newConnection.onclose((error) => {
                    console.error('Connection closed due to error:', error);
                    setIsConnected(false);
                });

                newConnection.start().then(() => {
                    setIsConnected(true);
                }).catch((error) => {
                    console.error('Error starting connection:', error);
                    setIsConnected(false);
                });

            } catch (error) {
                console.error('Error initializing connection:', error);
            }
        };

        initializeConnection();

        return () => {
            if (connectionRef.current?.state === HubConnectionState.Connected) {
                connectionRef.current.stop();
            }
        };
    }, [hubUrl, handleToken]);

    return [connectionRef.current, isConnected] as const;
};
