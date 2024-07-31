import { MutableRefObject } from 'react';
import { HubConnection } from '@microsoft/signalr';
import { getSubscribers, isEventRegistered, Subscriber } from '@/hooks/signalR/subscribers';
import { HubUrls } from '@/utils/globals';
import { HubConnections } from '@/hooks/signalR/initializeConnection';

export function bindEvents(sub: Subscriber) {
    const connection = HubConnections[sub.url];
    if (sub.options.current?.onEvents) {
        Object.entries(sub.options.current.onEvents).forEach(([eventName, eventHandler]) => {
            if (isEventRegistered(sub.url, eventName)) {
                console.warn(
                    `Event with name ${eventName} is already registered for ${sub.url}, and will be overwritten`,
                );
            }

            connection.on(eventName, eventHandler);
        });
    }
}

export function unbindEvents(
    hubConnection: MutableRefObject<HubConnection>,
    subscriber: Subscriber,
) {
    if (subscriber.options.current?.onEvents) {
        Object.entries(subscriber.options.current.onEvents).forEach(([eventName, eventHandler]) => {
            hubConnection.current.off(eventName, eventHandler);
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
