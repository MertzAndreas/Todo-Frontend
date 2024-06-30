"use client"
import { useState, useCallback } from 'react';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import { useToken } from './useToken';

export const useSignalR = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const { handleToken } = useToken();

    const isConnected = connection?.state === HubConnectionState.Connected || false;

    const createConnection = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token available');
        }

        const validToken = await handleToken(token);
        const newConnection = new HubConnectionBuilder()
            .withUrl(`http://localhost:5040/hub`, {
                accessTokenFactory: () => validToken,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        newConnection.onreconnecting((error) => {
            console.log("Connection lost due to error. Reconnecting.", error);
        });

        newConnection.onreconnected((connectionId) => {
            console.log("Reconnected. Connection ID:", connectionId);
        });

        newConnection.onclose((error) => {
            console.error("Connection closed due to error:", error);
            setConnection(null);
        });

        await newConnection.start();
        setConnection(newConnection);
        console.log('Connected to SignalR hub');
    }, [handleToken]);

    const stopConnection = useCallback(() => {
        if (connection) {
            connection.stop();
            setConnection(null);
        }
    }, [connection]);

    return { connection, isConnected, createConnection, stopConnection };
};
