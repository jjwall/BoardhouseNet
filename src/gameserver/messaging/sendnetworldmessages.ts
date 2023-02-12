import { NetMessageLoadWorld, NetMessagePlayerItemPickup, NetMessagePlayerNotification, NetMessagePlayerWorldTransition, NetMessageUnloadWorld, NetWorldEventTypes } from "../../packets/messages/networldmessage";
import { WorldTransitionData } from "../../packets/data/worldtransitiondata";
import { WorldLevelData } from "../../packets/data/worldleveldata";
import { MyWebSocket } from "../serverengine/setupgameserver";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { MessageTypes } from "../../packets/messages/message";
import { Server } from "../serverengine/server";
import { ItemPickupData } from "../../packets/data/itempickupdata";
import { NotificationData } from "src/packets/data/notificationdata";

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

export function sendPlayerWorldTransitionMessage(server: Server, worldTransitionData: WorldTransitionData, clientId: string, worldToLoad: WorldTypes) {
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

export function sendSpectatorWorldTransitionMessage() {
    // ...
}