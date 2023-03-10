import { NetMessageLoadWorld, NetMessagePlayerChatMessage, NetMessagePlayerItemPickup, NetMessagePlayerNotification, NetMessagePlayerReconcileInventory, NetMessagePlayerWorldTransition, NetMessageUnloadWorld, NetWorldEventTypes } from "../../packets/messages/networldmessage";
import { WorldTransitionData } from "../../packets/data/worldtransitiondata";
import { NotificationData } from "../../packets/data/notificationdata";
import { ChatMessageData } from "../../packets/data/chatmessagedata";
import { WorldLevelData } from "../../packets/data/worldleveldata";
import { ItemPickupData } from "../../packets/data/itempickupdata";
import { InventoryData } from "../../packets/data/inventorydata";
import { MyWebSocket } from "../serverengine/setupgameserver";
import { MessageTypes } from "../../packets/messages/message";
import { ItemData } from "../../packets/data/itemdata";
import { Server } from "../serverengine/server";

export function sendLoadWorldMessage(server: Server, worldLevelData: WorldLevelData, clientId: string) {
    const message: NetMessageLoadWorld = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.LOAD_WORLD,
        data: worldLevelData,
    }

    server.boardhouseServer.clients.forEach(client => {
        const myClient = client as MyWebSocket;

        if (myClient.clientId === clientId) {
            console.log(`(port: ${server.gameServerPort}): sending load world message to client with clientId = "${clientId}"`)
            client.send(JSON.stringify(message));
        }
    });
}

export function sendUnloadWorldMessage(server: Server, worldLevelData: WorldLevelData, clientId: string) {
    const message: NetMessageUnloadWorld = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.UNLOAD_WORLD,
    }

    server.boardhouseServer.clients.forEach(client => {
        const myClient = client as MyWebSocket;

        if (myClient.clientId === clientId) {
            console.log(`(port: ${server.gameServerPort}): sending unload world message to client with clientId = "${clientId}"`)
            client.send(JSON.stringify(message));
        }
    });
}

export function sendPlayerWorldTransitionMessage(server: Server, worldTransitionData: WorldTransitionData, clientId: string) {
    const message: NetMessagePlayerWorldTransition = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.PLAYER_WORLD_TRANSITION,
        data: worldTransitionData,
    }

    server.boardhouseServer.clients.forEach(client => {
        const myClient = client as MyWebSocket;

        if (myClient.clientId === clientId) {
            console.log(`(port: ${server.gameServerPort}): sending transition world message to client with clientId = "${clientId}"`)
            client.send(JSON.stringify(message));
        }
    });
}

export function broadcastPlayerItemPickupMessage(server: Server, itemPickupData: ItemPickupData) {
    const message: NetMessagePlayerItemPickup = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.PLAYER_ITEM_PICKUP,
        data: itemPickupData,
    }

    server.boardhouseServer.clients.forEach(client => {
        console.log(`(port: ${server.gameServerPort}): broadcasting player item pickup message. Pickup clientId = "${itemPickupData.pickupClientId}"`)
        client.send(JSON.stringify(message));
    });
}

export function sendPlayerReconcileInventoryMessage(server: Server, inventory: ItemData[], clientId: string) {
    const inventoryData: InventoryData = {
        inventory: inventory,
        clientId: clientId
    }

    const message: NetMessagePlayerReconcileInventory = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.PLAYER_RECONCILE_INVENTORY,
        data: inventoryData,
    }

    server.boardhouseServer.clients.forEach(client => {
        const myClient = client as MyWebSocket;

        if (myClient.clientId === clientId) {
            console.log(`(port: ${server.gameServerPort}): sending player reconcile inventory message to client with clientId = "${clientId}"`)
            client.send(JSON.stringify(message));
        }
    });
}

export function sendPlayerNotificationMessage(server: Server, notificationData: NotificationData) {
    const message: NetMessagePlayerNotification = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.PLAYER_NOTIFICATION,
        data: notificationData,
    }

    server.boardhouseServer.clients.forEach(client => {
        const myClient = client as MyWebSocket;

        if (myClient.clientId === notificationData.clientId) {
            console.log(`(port: ${server.gameServerPort}): sending notification message to client with clientId = "${notificationData.clientId}"`)
            client.send(JSON.stringify(message));
        }
    });
}

export function broadcastPlayerChatMessage(server: Server, chatMessageData: ChatMessageData) {
    const message: NetMessagePlayerChatMessage = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.PLAYER_CHAT_MESSAGE,
        data: chatMessageData
    }

    server.boardhouseServer.clients.forEach(client => {
        console.log(`(port: ${server.gameServerPort}): broadcasting player chat message for clientId = "${chatMessageData.clientId}"`)
        client.send(JSON.stringify(message));
    });
}

export function sendSpectatorWorldTransitionMessage() {
    // ...
}