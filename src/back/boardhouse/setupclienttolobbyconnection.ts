import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { GameServerInfo } from "./../../packets/gameserverinfo";

export function setUpClientToLobbyConnection(boardhouseBack: IBoardhouseBack) {
    boardhouseBack.connection.onopen = function() {
        console.log("New Game Server connection opened");
    }

    boardhouseBack.connection.onmessage = function(messageEvent: WebSocket.MessageEvent) {
        const jsonData = messageEvent.data;

        if (jsonData == "get connections") {
            const gameServerData: GameServerInfo = {
                port: boardhouseBack.gameServerPort,
                connections: boardhouseBack.connections,
            }

            boardhouseBack.connection.send(JSON.stringify(gameServerData));
        }
    }
}