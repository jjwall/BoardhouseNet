import { ClientWorldEventTypes, ClientMessagePlayerWorldJoin, ClientMessageSpectatorWorldJoin, ClientMessagePlayerWorldTransition, ClientMessagePlayerInventoryEvent, ClientMessagePlayerChatMessage } from "../../packets/messages/clientworldmessage";
import { WorldTransitionData } from "../../packets/data/worldtransitiondata";
import { MessageTypes } from "../../packets/messages/message";
import { Client } from "../clientengine/client";

export function sendPlayerWorldJoinMessage(client: Client) {
    const message: ClientMessagePlayerWorldJoin = {
        messageType: MessageTypes.CLIENT_WORLD_MESSAGE,
        eventType: ClientWorldEventTypes.PLAYER_WORLD_JOIN,
        data: {
            clientId: client.currentClientId,
            username: client.username,
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
        data: data,
    }

    console.log("player transitioning to worldType = " + data.newWorldType);
    client.connection.send(JSON.stringify(message));
}

export function sendSpectatorWorldJoinMessage(client: Client) {
    const message: ClientMessageSpectatorWorldJoin = {
        messageType: MessageTypes.CLIENT_WORLD_MESSAGE,
        eventType: ClientWorldEventTypes.SPECTATOR_WORLD_JOIN,
        data: {
            clientId: client.currentClientId,
            username: client.username,
            playerClass: client.playerClass,
            worldType: client.worldType,
        }
    }
    
    console.log("client joining as spectator");
    client.connection.send(JSON.stringify(message));
}

export function sendPlayerInventoryEventMessage(client: Client) {
    const message: ClientMessagePlayerInventoryEvent = {
        messageType: MessageTypes.CLIENT_WORLD_MESSAGE,
        eventType: ClientWorldEventTypes.PLAYER_INVENTORY_EVENT,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
            inventory: client.getUIState().clientInventory
        }
    }

    console.log("sending inventory event for player with client id: " + client.currentClientId);
    client.connection.send(JSON.stringify(message));
}

export function sendPlayerChatMessage(client: Client) {
    if (client.rootComponent.lastCharIsTextCursor())
        client.rootComponent.backspaceChatInputBoxContents();

    const message: ClientMessagePlayerChatMessage = {
        messageType: MessageTypes.CLIENT_WORLD_MESSAGE,
        eventType: ClientWorldEventTypes.PLAYER_CHAT_MESSAGE,
        data: {
            clientId: client.currentClientId,
            clientUsername: client.username,
            worldType: client.worldType,
            chatMessage: client.getUIState().chatInputBoxContents
        }
    }

    console.log("sending player chat message for player with client id: " + client.currentClientId);
    client.connection.send(JSON.stringify(message));
}