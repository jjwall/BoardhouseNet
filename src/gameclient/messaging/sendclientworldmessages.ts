import { ClientWorldEventTypes, ClientMessagePlayerWorldJoin, ClientMessageSpectatorWorldJoin, ClientMessagePlayerWorldTransition } from "../../packets/clientworldmessage";
import { WorldTransitionData } from "../../packets/worldtransitiondata";
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
    const message: ClientMessagePlayerWorldTransition = {
        eventType: ClientWorldEventTypes.PLAYER_WORLD_TRANSITION,
        messageType: MessageTypes.CLIENT_WORLD_MESSAGE,
        worldType: client.worldType, // unnecessary
        data: data,
    }

    console.log("player transitioning to worldType = " + data.newWorldType);
    client.connection.send(JSON.stringify(message));
}

export function sendSpectatorWorldJoinMessage(client: Client) {
    const message: ClientMessageSpectatorWorldJoin = {
        messageType: MessageTypes.CLIENT_WORLD_MESSAGE,
        eventType: ClientWorldEventTypes.SPECTATOR_WORLD_JOIN,
        worldType: null, // discard
        data: {
            clientId: client.currentClientId,
            playerClass: client.playerClass,
            worldType: client.worldType,
        }
    }
    
    console.log("client joining as spectator");
    client.connection.send(JSON.stringify(message));
}