import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { GameServerInfo } from "../../packets/gameserverinfo";

export function setUpClientToLobbyConnection(boardhouseBack: IBoardhouseBack) {
    boardhouseBack.clientConnection.onopen = function() {
        console.log(`(port: ${boardhouseBack.gameServerPort}): connection to lobby established`);
    }

    boardhouseBack.clientConnection.onmessage = function(messageEvent: WebSocket.MessageEvent) {
        const jsonData = messageEvent.data;

        if (jsonData == "get connections") {
            const gameServerData: GameServerInfo = {
                port: boardhouseBack.gameServerPort,
                playersConnected: boardhouseBack.playerClientIds.length,
                spectatorsConnected: boardhouseBack.spectatorClientIds.length,
            }

            boardhouseBack.clientConnection.send(JSON.stringify(gameServerData));
        }
    }
}