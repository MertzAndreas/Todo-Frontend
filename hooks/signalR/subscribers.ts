import {HubUrls} from "@/utils/globals";
import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {HubConnectionState} from "@microsoft/signalr";
import {HubConnectionOptions} from "@/hooks/signalR/useSignalR";

export type Subscribers = {
    [url: string]: Set<Subscriber>,
}
export type Subscriber = {
    url: HubUrls;
    setConnectionStatus: Dispatch<SetStateAction<HubConnectionState>>;
    options: MutableRefObject<HubConnectionOptions>;
}

const subscribers: Subscribers = {};
const EMPTY_LIST: Subscriber[] = [];

export const getSubscribers = (url: string): Subscriber[] => {
    if (hasSubscribers(url)) {
        return Array.from(subscribers[url]);
    }
    return EMPTY_LIST;
};

export const hasSubscribers = (url: string): boolean => {
    return subscribers[url]?.size > 0;
};

export const addSubscriber = (url: string, subscriber: Subscriber): void => {
    subscribers[url] = subscribers[url] || new Set<Subscriber>();
    subscribers[url].add(subscriber);
};

export const setSubscribersStatusToConnected = (url: string): void => {
    getSubscribers(url).forEach(subscriber => {
        subscriber.setConnectionStatus(HubConnectionState.Connected);
    });
}
export const removeSubscriber = (url: string, subscriber: Subscriber): void => {
    subscribers[url].delete(subscriber);
};

export const isEventRegistered = (url: string, eventName: string): boolean => {
    const subscribers = getSubscribers(url);
    return subscribers.some(subscriber => {
        return subscriber.options.current.onEvents?.hasOwnProperty(eventName);
    });
}