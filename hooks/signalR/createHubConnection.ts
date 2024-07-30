import {BASE_URL, HubUrls} from "@/utils/globals";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

export function createHubConnection(url: HubUrls, token: () => Promise<string>) {
    const fullUrl = BASE_URL + url
    return new HubConnectionBuilder()
        .withUrl(fullUrl, {
            accessTokenFactory: token,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
}