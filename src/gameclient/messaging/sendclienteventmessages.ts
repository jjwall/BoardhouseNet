import { ClientEventMessage } from "../../packets/clienteventmessage";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { MessageTypes } from "../../packets/messagetypes";
import { Client } from "../clientengine/client";

export function sendPlayerJoinedMessage(client: Client) {
    const message: ClientEventMessage = {
        messageType: MessageTypes.CLIENT_EVENT_MESSAGE,
        eventType: ClientEventTypes.PLAYER_JOINED,
        clientId: client.currentClientId,
        playerClass: client.playerClass,
        worldType: client.worldType,
    }
    
    console.log("client joining as player");
    client.connection.send(JSON.stringify(message));
}

export function sendSpectatorJoinedMessage(client: Client) {
    const message: ClientEventMessage = {
        messageType: MessageTypes.CLIENT_EVENT_MESSAGE,
        eventType: ClientEventTypes.SPECTATOR_JOINED,
        clientId: client.currentClientId,
        playerClass: client.playerClass,
        worldType: client.worldType,
    }
    
    console.log("client joining as spectator");
    client.connection.send(JSON.stringify(message));
}