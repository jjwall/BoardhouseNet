import { NetMessageLoadWorld, NetMessagePlayerWorldTransition, NetMessageUnloadWorld, NetWorldEventTypes } from "../../packets/messages/networldmessage";
import { WorldTransitionData } from "../../packets/data/worldtransitiondata";
import { WorldLevelData } from "../../packets/data/worldleveldata";
import { MyWebSocket } from "../serverengine/setupgameserver";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { MessageTypes } from "../../packets/messages/message";
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

export function sendSpectatorWorldTransitionMessage() {
    // ...
}