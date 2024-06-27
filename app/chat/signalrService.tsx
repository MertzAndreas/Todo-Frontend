// src/signalrService.js
import {HubConnectionBuilder} from "@microsoft/signalr";

const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5001/hub")
    .withAutomaticReconnect()
    .build();

export default connection;
