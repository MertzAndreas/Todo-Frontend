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
    setSubscribersStatusToConnected,
    Subscriber,
} from '@/hooks/signalR/subscribers';

type HubConnectionProps = {
    [url in HubUrls]?: HubConnection;
};
export const HubConnections: HubConnectionProps = {};

export const initializeConnection = (
    url: HubUrls,
    token: () => Promise<string>,
    hubConnection: MutableRefObject<HubConnection>,
    setConnectionStatus: Dispatch<SetStateAction<HubConnectionState>>,
    optionsCache: MutableRefObject<HubConnectionOptions>,
) => {
    const subscriber: Subscriber = {
        url,
        setConnectionStatus,
        options: optionsCache,
    };

    if (!HubConnections[url]) {
        createNewConnection(url, token, hubConnection, setConnectionStatus, subscriber);
    } else {
        reuseConnection(hubConnection, url, setConnectionStatus, subscriber);
    }

    return cleanUpConnection(url, hubConnection, subscriber);
};

function createNewConnection(
    url: HubUrls,
    token: () => Promise<string>,
    hubConnection: MutableRefObject<HubConnection>,
    setConnectionStatus: Dispatch<SetStateAction<HubConnectionState>>,
    subscriber: Subscriber,
) {
    HubConnections[url] = createHubConnection(url, token);
    hubConnection.current = HubConnections[url];
    setConnectionStatus(HubConnectionState.Connecting);
    bindReconnect(hubConnection.current, url);
    bindEvents(subscriber);
    addSubscriber(url, subscriber);
    hubConnection.current
        .start()
        .then(() => {
            console.assert(hubConnection.current.state === HubConnectionState.Connected);
            setSubscribersStatusToConnected(url);
        })
        .catch(console.error);
}

function reuseConnection(
    hubConnection: MutableRefObject<HubConnection>,
    url: HubUrls,
    setConnectionStatus: Dispatch<SetStateAction<HubConnectionState>>,
    subscriber: Subscriber,
) {
    hubConnection.current = HubConnections[url];
    console.assert(hubConnection.current.state === HubConnections[url].state);
    setConnectionStatus(HubConnections[url].state);
    bindEvents(subscriber);
    addSubscriber(url, subscriber);
}

const cleanUpConnection = (
    url: HubUrls,
    hubConnection: MutableRefObject<HubConnection>,
    subscriber: Subscriber,
) => {
    return () => {
        unbindEvents(hubConnection, subscriber);
        removeSubscriber(url, subscriber);

        //Delay is needed as it ensures that asynchronous operations and state updates occur in the correct order
        setTimeout(() => {
            if (hasSubscribers(url)) return;
            hubConnection.current
                ?.stop()
                .catch(console.error)
                .finally(() => {
                    delete HubConnections[url];
                    subscriber.setConnectionStatus(HubConnectionState.Disconnected);
                });
        });
    };
};
