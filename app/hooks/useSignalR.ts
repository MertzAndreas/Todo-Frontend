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
    const { getToken } = useToken();

    const connectionRef = useRef<HubConnection | null>(null);
    let didInit = false

    useEffect(() => {
        const initializeConnection = async () => {
            if(didInit) return;
            try {
                didInit = true;
                const validToken = await getToken();

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
    }, [hubUrl, getToken]);

    return [connectionRef.current, isConnected] as const;
};
