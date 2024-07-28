import {HubConnection} from "@microsoft/signalr";

export const BASE_URL = 'http://localhost:5040';

export type HubUrls = "/chat" | "/kanban" | "/logbook";

type HubConnectionProps = {
    [url in HubUrls]?: HubConnection;
};

export const HubConnections: HubConnectionProps = {};