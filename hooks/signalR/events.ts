import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { getSubscribers, isEventRegistered, Subscriber } from '@/hooks/signalR/subscribers';
import { HubUrls } from '@/utils/globals';
import { CustomHub, HubConnections } from '@/hooks/signalR/initializeConnection';
import { MutableRefObject } from 'react';

export function bindEvents(sub: Subscriber) {
    const con = HubConnections[sub.url];
    if (sub.options.current?.onEvents) {
        Object.entries(sub.options.current.onEvents).forEach(([eventName, eventHandler]) => {
            if (isEventRegistered(sub.url, eventName)) {
                console.warn(
                    `Event with name ${eventName} is already registered for ${sub.url}, and will be overwritten`,
                );
            }

            con.connection.on(eventName, eventHandler);
        });
    }

    con.connection.onclose(() => sub.setConnectionStatus(HubConnectionState.Disconnected));
    con.connection.onreconnecting(() => sub.setConnectionStatus(HubConnectionState.Reconnecting));
    con.connection.onreconnected(() => sub.setConnectionStatus(HubConnectionState.Connected));
}

export function unbindEvents(hubConnection: MutableRefObject<CustomHub>, subscriber: Subscriber) {
    if (subscriber.options.current?.onEvents) {
        Object.entries(subscriber.options.current.onEvents).forEach(([eventName, eventHandler]) => {
            hubConnection.current.connection.off(eventName, eventHandler);
        });
    }
}

export function bindReconnect(connection: HubConnection, url: HubUrls) {
    connection.onreconnecting(() => {
        getSubscribers(url).forEach((sub) => {
            if (sub.options.current.onReconnecting) {
                sub.options.current.onReconnecting();
            }
        });
    });
}
