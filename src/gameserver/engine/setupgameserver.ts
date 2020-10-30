import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { EntityMessage } from "../../packets/entitymessage";
import { ClientMessage } from "../../packets/clientmessage";
import { sendCreateOrUpdateEntityMessage } from "../messaging/sendmessages";
import { Entity } from "../states/gameplay/entity";
import { ClientEventTypes } from "../../packets/clienteventtypes";

export function setUpGameServer(boardhouseBack: IBoardhouseBack) {
    boardhouseBack.boardhouseServer = new WebSocket.Server({ port: Number(boardhouseBack.gameServerPort) });

    boardhouseBack.boardhouseServer.on("connection", function connection(ws) {
        boardhouseBack.boardhouseSocket = ws;
        console.log("client connected");
        boardhouseBack.connections++;
        

        ws.on("message", function incoming(message) {
            console.log("received: %s", message);
            const clientMessage: ClientMessage = JSON.parse(message.toString());

            if (clientMessage.eventType === ClientEventTypes.PLAYER_JOINED) {
                ws.url = clientMessage.clientId;
                boardhouseBack.playerClientIds.push(clientMessage.clientId);
            }

            if (clientMessage.eventType === ClientEventTypes.SPECTATOR_JOINED) {
                ws.url = clientMessage.clientId;
                boardhouseBack.spectatorClientIds.push(clientMessage.clientId);
            }

            boardhouseBack.messagesToProcess.push(clientMessage);
        });

        ws.on("close", function(event) {
            const playerIndex = boardhouseBack.playerClientIds.indexOf(ws.url);
            const spectatorIndex = boardhouseBack.spectatorClientIds.indexOf(ws.url);

            if (playerIndex > -1) {
                boardhouseBack.playerClientIds.splice(playerIndex, 1);
                console.log(`player with clientId = ${ws.url} disconnected`);
            }

            if (spectatorIndex > -1) {
                boardhouseBack.spectatorClientIds.splice(spectatorIndex, 1);
                console.log(`spectator with clientId = ${ws.url} disconnected`);
            }
            
            boardhouseBack.connections--;
        })
    });
}