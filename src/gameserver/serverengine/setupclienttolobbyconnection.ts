import * as WebSocket from "ws";
import { GameServerInfo } from "../../packets/gameserverinfo";
import { Server } from "./server";

export function setUpClientToLobbyConnection(server: Server) {
    server.clientConnection.onopen = function() {
        console.log(`(port: ${server.gameServerPort}): connection to lobby established`);
    }

    server.clientConnection.onmessage = function(messageEvent: WebSocket.MessageEvent) {
        const jsonData = messageEvent.data;

        if (jsonData == "get connections") {
            const gameServerData: GameServerInfo = {
                port: server.gameServerPort,
                playersConnected: server.playerClientIds.length,
                spectatorsConnected: server.spectatorClientIds.length,
            }

            server.clientConnection.send(JSON.stringify(gameServerData));
        }
    }
}