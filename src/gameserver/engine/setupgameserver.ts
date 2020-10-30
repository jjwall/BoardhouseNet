import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { EntityMessage } from "../../packets/entitymessage";
import { ClientMessage } from "../../packets/clientmessage";
import { sendCreateOrUpdateEntityMessage } from "../messaging/sendmessages";
import { Entity } from "../states/gameplay/entity";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { ClientRoleTypes } from "../../packets/clientroletypes";

class MyWebSocket extends WebSocket {
    clientId: string;
    clientRole: ClientRoleTypes;
}

export function setUpGameServer(boardhouseBack: IBoardhouseBack) {
    boardhouseBack.boardhouseServer = new MyWebSocket.Server({ port: Number(boardhouseBack.gameServerPort) });

    boardhouseBack.boardhouseServer.on("connection", function connection(ws: MyWebSocket) {
        boardhouseBack.boardhouseSocket = ws;
        console.log(`(port: ${boardhouseBack.gameServerPort}): client connected`);

        ws.on("message", function incoming(message) {
            console.log(`(port: ${boardhouseBack.gameServerPort}) received: ${message}`);
            const clientMessage: ClientMessage = JSON.parse(message.toString());

            if (clientMessage.eventType === ClientEventTypes.PLAYER_JOINED) {
                ws.clientId = clientMessage.clientId;
                ws.clientRole = ClientRoleTypes.PLAYER;
                boardhouseBack.playerClientIds.push(clientMessage.clientId);
            }

            if (clientMessage.eventType === ClientEventTypes.SPECTATOR_JOINED) {
                ws.clientId = clientMessage.clientId;
                ws.clientRole = ClientRoleTypes.SPECTATOR;
                boardhouseBack.spectatorClientIds.push(clientMessage.clientId);
            }

            boardhouseBack.messagesToProcess.push(clientMessage);
        });

        ws.on("close", function() {
            switch (ws.clientRole) {
                case ClientRoleTypes.PLAYER:
                    const playerIndex = boardhouseBack.playerClientIds.indexOf(ws.clientId);

                    if (playerIndex > -1) {
                        boardhouseBack.playerClientIds.splice(playerIndex, 1);
                        console.log(`(port: ${boardhouseBack.gameServerPort}): player with clientId = "${ws.clientId}" disconnected`);
                    }
                    break;
                case ClientRoleTypes.SPECTATOR:
                    const spectatorIndex = boardhouseBack.spectatorClientIds.indexOf(ws.clientId);

                    if (spectatorIndex > -1) {
                        boardhouseBack.spectatorClientIds.splice(spectatorIndex, 1);
                        console.log(`(port: ${boardhouseBack.gameServerPort}): spectator with clientId = "${ws.clientId}" disconnected`);
                    }
                    break;
            }
        })
    });
}