import { HubUrls } from '@/utils/globals';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { HubConnectionOptions } from '@/hooks/signalR/useSignalR';
import { bindEvents, bindReconnect, unbindEvents } from '@/hooks/signalR/events';
import { createHubConnection } from '@/hooks/signalR/createHubConnection';
import {
    addSubscriber,
    hasSubscribers,
    removeSubscriber,
    Subscriber,
} from '@/hooks/signalR/subscribers';
import { ToastId } from '@chakra-ui/react';

export type CustomHub = {
    connection?: HubConnection;
    toastId: MutableRefObject<ToastId>;
};

type HubConnectionProps = {
    [url in HubUrls]?: CustomHub;
};
export const HubConnections: HubConnectionProps = {};

export const initializeConnection = (
    url: HubUrls,
    token: () => Promise<string>,
    hubConnection: MutableRefObject<CustomHub>,
    setConnectionStatus: Dispatch<SetStateAction<HubConnectionState>>,
    optionsCache: MutableRefObject<HubConnectionOptions>,
    toastId: MutableRefObject<ToastId>,
) => {
    const subscriber: Subscriber = {
        url,
        setConnectionStatus,
        options: optionsCache,
    };

    if (!HubConnections[url]) {
        void createNewConnection(
            url,
            token,
            hubConnection,
            setConnectionStatus,
            subscriber,
            toastId,
        );
    } else {
        reuseConnection(hubConnection, url, setConnectionStatus, subscriber);
    }

    return cleanUpConnection(url, hubConnection, subscriber);
};

const createNewConnection = async (
    url: HubUrls,
    token: () => Promise<string>,
    hubConnection: MutableRefObject<CustomHub>,
    setConnectionStatus: Dispatch<SetStateAction<HubConnectionState>>,
    subscriber: Subscriber,
    toastId: MutableRefObject<ToastId>,
) => {
    if (!HubConnections[url]) {
        HubConnections[url] = { toastId: toastId };
    }

    HubConnections[url].connection = createHubConnection(url, token);
    hubConnection.current = HubConnections[url];
    bindReconnect(hubConnection.current.connection, url);
    bindEvents(subscriber);
    addSubscriber(url, subscriber);
    setConnectionStatus(HubConnectionState.Connecting);

    let timeOut = 1000;
    const maxTimeout = 10000;

    const start = async () => {
        try {
            await hubConnection.current.connection.start();
            setConnectionStatus(HubConnectionState.Connected);
            console.assert(hubConnection.current.connection.state === HubConnectionState.Connected);
            timeOut = 1000;
        } catch (err) {
            console.log(`Connection failed: ${err.message}`);
            setTimeout(() => {
                if (timeOut > maxTimeout) setConnectionStatus(HubConnectionState.Disconnected);
                start();
            }, timeOut);
            timeOut = Math.min(2 * timeOut, maxTimeout);
        }
    };

    await start();
};

const reuseConnection = (
    hubConnection: MutableRefObject<CustomHub>,
    url: HubUrls,
    setConnectionStatus: Dispatch<SetStateAction<HubConnectionState>>,
    subscriber: Subscriber,
) => {
    hubConnection.current = HubConnections[url];
    setConnectionStatus(HubConnections[url].connection.state);
    bindEvents(subscriber);
    addSubscriber(url, subscriber);
};

const cleanUpConnection = (
    url: HubUrls,
    hubConnection: MutableRefObject<CustomHub>,
    subscriber: Subscriber,
) => {
    return () => {
        unbindEvents(hubConnection, subscriber);
        removeSubscriber(url, subscriber);

        //Delay is needed as it ensures that asynchronous operations and state updates occur in the correct order
        setTimeout(() => {
            if (hasSubscribers(url)) return;
            hubConnection.current.connection
                ?.stop()
                .catch(console.error)
                .finally(() => {
                    delete HubConnections[url];
                    subscriber.setConnectionStatus(HubConnectionState.Disconnected);
                });
        });
    };
};
