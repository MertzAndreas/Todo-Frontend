import { useCallback, useEffect, useRef, useState } from 'react';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { CustomHub, initializeConnection } from '@/hooks/signalR/initializeConnection';
import { HubUrls } from '@/utils/globals';
import useAuthContext from '@/providers/AuthProvider';
import { ToastId, useToast, UseToastOptions } from '@chakra-ui/react';
import { TrashBinIcon } from '@/utils/icons';
import { connectionToast } from '@/hooks/signalR/connectionToast';

type MessageType = 'send' | 'invoke';

type Message = {
    hubMethod: string;
    args?: unknown[] | undefined;
    type: MessageType;
    resolve?: (value?: unknown) => void;
    reject?: (reason?: any) => void;
};

type EventCallbacks = {
    [eventName: string]: (...args: any[]) => void;
};

export type HubConnectionOptions = {
    onEvents?: EventCallbacks;
    onReconnecting?: () => void;
};

const DEFAULT_OPTIONS: HubConnectionOptions = {
    onEvents: {},
    onReconnecting: () => {},
};

const useHubConnection = (hubUrl: HubUrls, options: HubConnectionOptions = DEFAULT_OPTIONS) => {
    const { getToken, isAuthenticated } = useAuthContext();
    const [connectionStatus, setConnectionStatus] = useState<HubConnectionState>(
        HubConnectionState.Disconnected,
    );
    const toast = useToast();
    const hubConnection = useRef<CustomHub | null>(null);
    const messageQueue = useRef<Message[]>([]);
    const optionsCache = useRef<HubConnectionOptions>(options);
    const toastId = useRef<ToastId>(null);
    optionsCache.current = options;

    const handleMessage = useCallback(async (message: Message) => {
        if (hubConnection.current?.connection.state !== HubConnectionState.Connected) {
            messageQueue.current.push(message);
            return;
        }

        const args = message.args || [];
        try {
            let result;
            switch (message.type) {
                case 'invoke':
                    result = await hubConnection.current.connection.invoke(
                        message.hubMethod,
                        ...args,
                    );
                    if (message.resolve) {
                        message.resolve(result);
                    }
                    break;
                case 'send':
                    await hubConnection.current.connection.send(message.hubMethod, ...args);
                    if (message.resolve) {
                        message.resolve();
                    }
                    break;
            }
        } catch (error) {
            if (message.reject) {
                message.reject(error);
            }
        }
    }, []);

    const sendMessage = useCallback(
        (hubMethod: string, args?: unknown[]) => {
            const message: Message = { hubMethod, args, type: 'send' };
            return new Promise<void>((resolve, reject) => {
                message.resolve = resolve;
                message.reject = reject;
                handleMessage(message);
            });
        },
        [handleMessage],
    );

    const invokeMethod = useCallback(
        (hubMethod: string, args?: unknown[]): Promise<any> => {
            const message: Message = { hubMethod, args, type: 'invoke' };
            return new Promise<any>((resolve, reject) => {
                message.resolve = resolve;
                message.reject = reject;
                handleMessage(message);
            });
        },
        [handleMessage],
    );

    useEffect(() => {
        if (hubUrl !== null && hubUrl.length !== 0) {
            const cleanUp = initializeConnection(
                hubUrl,
                getToken,
                hubConnection,
                setConnectionStatus,
                optionsCache,
                toastId,
            );
            return () => {
                cleanUp?.();
                setConnectionStatus(HubConnectionState.Disconnected);
            };
        }
    }, [hubUrl, getToken, isAuthenticated]);

    useEffect(() => {
        if (connectionStatus === HubConnectionState.Connected) {
            messageQueue.current.forEach(async (message) => {
                await handleMessage(message);
            });
            messageQueue.current = [];
        }
    }, [connectionStatus, handleMessage]);

    useEffect(() => {
        connectionToast(connectionStatus, toast, hubUrl);
    }, [toast, connectionStatus, hubUrl]);

    return { connectionStatus, sendMessage, invokeMethod };
};

export default useHubConnection;
