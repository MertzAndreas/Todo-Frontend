"use client"
import React, { createContext, useContext, ReactNode } from 'react';
import { HubConnection } from "@microsoft/signalr";
import { useSignalR } from "@/app/hooks/useSignalR";

interface SignalRContextType {
    connection: HubConnection | null;
    isConnected: boolean;
    createConnection: () => Promise<void>;
    stopConnection: () => void;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const useSignalRContext = (): SignalRContextType => {
    const context = useContext(SignalRContext);

    if (!context) {
        throw new Error('useSignalRContext must be used within a SignalRProvider');
    }
    return context;
};

interface SignalRProviderProps {
    children: ReactNode;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
    const { connection, isConnected, createConnection, stopConnection } = useSignalR();

    return (
        <SignalRContext.Provider value={{ connection, isConnected, createConnection, stopConnection }}>
            {children}
        </SignalRContext.Provider>
    );
};
