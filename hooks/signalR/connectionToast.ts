import { HubConnectionState } from '@microsoft/signalr';
import { CreateToastFnReturn, ToastId, UseToastOptions } from '@chakra-ui/react';
import { MutableRefObject } from 'react';
import { CustomHub, HubConnections } from '@/hooks/signalR/initializeConnection';
import { HubUrls } from '@/utils/globals';

type ToastOptionsMap = {
    [key in HubConnectionState]: UseToastOptions;
};

const toastOptionsMap: ToastOptionsMap = {
    [HubConnectionState.Disconnected]: {
        title: 'Connection is disconnected',
        status: 'info',
        duration: 10000,
    },
    [HubConnectionState.Connecting]: {
        title: 'Connecting...',
        status: 'loading',
        duration: 20000,
    },
    [HubConnectionState.Connected]: {
        title: 'Connected',
        status: 'success',
    },
    [HubConnectionState.Disconnecting]: {
        title: 'Disconnecting...',
        status: 'warning',
    },
    [HubConnectionState.Reconnecting]: {
        title: 'Reconnecting...',
        status: 'loading',
    },
};

export const connectionToast = (
    connectionStatus: HubConnectionState,
    toast: CreateToastFnReturn,
    hubUrl: HubUrls,
) => {
    const toastOptions = toastOptionsMap[connectionStatus];
    if (!HubConnections[hubUrl]) return;

    const formattedHubUrl = hubUrl.replace('/', ' ').toWellFormed();

    if (toast.isActive(HubConnections[hubUrl].toastId.current)) {
        toast.update(HubConnections[hubUrl].toastId.current, {
            title: toastOptions.title + formattedHubUrl,
            status: toastOptions.status,
        });
    } else {
        HubConnections[hubUrl].toastId.current = toast({
            title: toastOptions.title + formattedHubUrl,
            status: toastOptions.status,
            duration: toastOptions.duration || 5000,
        });
    }
};
