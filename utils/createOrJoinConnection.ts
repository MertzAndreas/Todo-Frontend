import {BASE_URL, HubConnections, HubUrls} from "@/utils/globals";
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {HubConnectionOptions} from "@/hooks/useSignalR";
import {
    addSubscriber,
    removeSubscriber,
    hasSubscribers,
    Subscriber,
    getSubscribers,
    isEventRegistered, setConnectionStatuses
} from "@/utils/subscribers";

export const createOrJoinConnection = (
    url: HubUrls,
    token: () => Promise<string>,
    hubConnection: MutableRefObject<HubConnection>,
    setConnectionStatus: Dispatch<SetStateAction<HubConnectionState>>,
    optionsCache: MutableRefObject<HubConnectionOptions>
) => {
    const subscriber: Subscriber = {
        url,
        setConnectionStatus,
        options: optionsCache
    }

    if (HubConnections[url] === undefined) {
        HubConnections[url] = createHubConnection(url, token);
        hubConnection.current = HubConnections[url];
        setConnectionStatus(HubConnectionState.Connecting);
        handleConnectionEvents(url, subscriber);
        addSubscriber(url, subscriber);
        hubConnection.current
            .start()
            .then(() => {
                console.assert(hubConnection.current.state === HubConnectionState.Connected);
                setConnectionStatuses(url);

            })
            .catch(console.error);

    } else {

        hubConnection.current = HubConnections[url];
        console.assert(hubConnection.current.state === HubConnections[url].state);
        setConnectionStatus(HubConnections[url].state);
        handleConnectionEvents(url, subscriber);
        addSubscriber(url, subscriber);
    }

    return cleanUpConnection(
        url,
        hubConnection,
        subscriber);
}

function createHubConnection(url: HubUrls, token: () => Promise<string>) {
    const fullUrl = BASE_URL + url
    return new HubConnectionBuilder()
        .withUrl(fullUrl, {
            accessTokenFactory: token,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
}

function handleConnectionEvents(url: HubUrls, sub: Subscriber) {
    const connection = HubConnections[url];
    const subscribers = getSubscribers(url);

    connection.onclose(() => {
        subscribers.forEach(subscriber => {
            if (subscriber.options.current.onClose) {
                subscriber.options.current.onClose();
            }
        });
    })

    connection.onreconnecting(() => {
        subscribers.forEach(subscriber => {
            if (subscriber.options.current.onReconnecting) {
                subscriber.options.current.onReconnecting();
            }
        });
    })

    if (sub.options.current?.onEvents) {
        Object.entries(sub.options.current.onEvents).forEach(([eventName, eventHandler]) => {
            if (isEventRegistered(url, eventName)) {
                console.warn(`Event with name ${eventName} is already registered for ${url}, and will be overwritten`);
            }

            connection.on(eventName, eventHandler);
        });
    }
}


const cleanUpConnection = (
    url: HubUrls,
    hubConnection: MutableRefObject<HubConnection>,
    subscriber: Subscriber
) => {
    return () => {
        removeSubscriber(url, subscriber);
        unbindEvents(hubConnection, subscriber);
        setTimeout(() => {
            if (hasSubscribers(url)) return
            hubConnection.current
                ?.stop()
                .catch(console.error)
                .finally(() => {
                    delete HubConnections[url];
                    subscriber.setConnectionStatus(HubConnectionState.Disconnected);
                });
        }, 100);
    }
}

function unbindEvents(hubConnection: MutableRefObject<HubConnection>, subscriber: Subscriber) {
    if (subscriber.options.current?.onEvents) {
        Object.entries(subscriber.options.current.onEvents).forEach(([eventName, eventHandler]) => {
            hubConnection.current.off(eventName, eventHandler);
        });
    }
}