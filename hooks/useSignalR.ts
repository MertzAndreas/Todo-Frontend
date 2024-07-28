import {useCallback, useEffect, useRef, useState} from "react";
import {HubConnection, HubConnectionState} from "@microsoft/signalr";
import {createOrJoinConnection} from "@/utils/createOrJoinConnection";
import {HubUrls} from "@/utils/globals";
import useAuthContext from "@/providers/AuthProvider";

type MessageType = 'send' | 'invoke';

type Message = {
    hubMethod: string;
    args?: unknown[] | undefined;
    type: MessageType;
};

type EventCallbacks = {
    [eventName: string]: (...args: any[]) => void;
};

export type HubConnectionOptions = {
    onEvents?: EventCallbacks;
    onReconnecting?: () => void;
    onClose?: () => void;
}

const DEFAULT_OPTIONS: HubConnectionOptions = {
    onEvents: {},
    onReconnecting: () => {
        console.log('Reconnecting to hub')
    },
    onClose: () => {
        console.log('Hub connection closed')
    }
}

const useHubConnection = (
    hubUrl: HubUrls,
    options: HubConnectionOptions = DEFAULT_OPTIONS,
    needsAuth = true
) => {
    const {getToken, isAuthenticated} = useAuthContext();
    const [connectionStatus, setConnectionStatus] = useState<HubConnectionState>(HubConnectionState.Disconnected);
    const hubConnection = useRef<HubConnection | null>(null)
    const messageQueue = useRef<Message[]>([]);
    const optionsCache = useRef<HubConnectionOptions>(options);
    optionsCache.current = options;

    const handleMessage = useCallback(async (message: Message) => {

        if (!(hubConnection.current?.state === HubConnectionState.Connected)) {
            messageQueue.current.push(message);
            return;
        }

        const args = message.args || [];

        if (message.type === 'invoke') {
            await hubConnection.current.invoke(message.hubMethod, ...args);
        } else {
            await hubConnection.current.send(message.hubMethod, ...args);
        }
    }, []);

    const sendMessage = useCallback(async (hubMethod: string, args?: unknown[]) => {
        const message: Message = {hubMethod, args, type: 'send'};
        await handleMessage(message);
    }, [handleMessage]);

    const invokeMethod = useCallback(async (hubMethod: string, args?: unknown[]) => {
        const message: Message = {hubMethod, args, type: 'invoke'};
        await handleMessage(message);
    }, [handleMessage]);


    useEffect(() => {
        if (hubUrl !== null && hubUrl.length !== 0 && (!needsAuth || isAuthenticated)) {
            let cleanUp: () => void;
            let createOrJoin = true;


            const start = () => {
                if (createOrJoin) {
                    cleanUp = createOrJoinConnection(hubUrl, getToken, hubConnection, setConnectionStatus, optionsCache);
                }
            }
            start();
            return () => {
                createOrJoin = false;
                cleanUp?.();
                setConnectionStatus(HubConnectionState.Disconnected);
            };
        }
    }, [hubUrl, getToken, needsAuth, isAuthenticated]);

    useEffect(() => {
        if (connectionStatus === HubConnectionState.Connected) {
            messageQueue.current.forEach(async message => {
                await handleMessage(message);
            });
            messageQueue.current = [];
        }
    }, [connectionStatus, handleMessage]);

    return {connectionStatus, sendMessage, invokeMethod};
}

export default useHubConnection;