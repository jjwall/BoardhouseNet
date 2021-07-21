import { ClientWorldMessage, ClientWorldEventTypes, ClientMessagePlayerWorldJoin } from "../../packets/clientworldmessage";
import { WorldTransitionData } from "../../packets/worldtransitiondata";
import { ClientEventMessage } from "../../packets/clienteventmessage";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { MessageTypes } from "../../packets/message";
import { Client } from "../clientengine/client";

export function sendPlayerWorldJoinMessage(client: Client) {
    const message: ClientMessagePlayerWorldJoin = {
        messageType: MessageTypes.CLIENT_WORLD_MESSAGE,
        eventType: ClientWorldEventTypes.PLAYER_WORLD_JOIN,
        worldType: null, // discard
        data: {
            clientId: client.currentClientId,
            playerClass: client.playerClass,
            worldType: client.worldType,
        }
    }
    
    console.log("client joining as player");
    client.connection.send(JSON.stringify(message));
}

export function sendPlayerWorldTransitionMessage(client: Client, data: WorldTransitionData) {
    const message: ClientWorldMessage = {
        eventType: ClientWorldEventTypes.PLAYER_WORLD_TRANSITION,
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