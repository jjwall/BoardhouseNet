import { WorldTransitionData } from "../../packets/worldtransitiondata";
import { ClientEventMessage } from "../../packets/clienteventmessage";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { MessageTypes } from "../../packets/messagetypes";
import { Client } from "../clientengine/client";
import { ClientWorldMessage, ClientWorldEventTypes } from "../../packets/clientworldmessage";

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

// test message - may not need client world messages after and just use events instead
export function sendPlayerJoinedWorldTransitionMessage(client: Client, data: WorldTransitionData) {
    const message: ClientWorldMessage = {
        eventTypes: ClientWorldEventTypes.PLAYER_WORLD_TRANSITION,
        messageType: MessageTypes.CLIENT_WORLD_MESSAGE,
        worldType: client.worldType, // unnecessary
        data: data,
    }

    console.log("player transitioning to worldType = " + data.newWorldType);
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