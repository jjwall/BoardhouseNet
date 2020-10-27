import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { EntityMessage } from "../../../packets/entitymessage";
import { PlayerMessage } from "../../../packets/playermessage";
import { sendCreateOrUpdateEntityMessage } from "../messaging/sendmessages";
import { Entity } from "../states/gameplay/entity";

export function setUpGameServer(boardhouseBack: IBoardhouseBack) {
    boardhouseBack.boardhouseServer = new WebSocket.Server({ port: Number(boardhouseBack.gameServerPort) });

    boardhouseBack.boardhouseServer.on("connection", function connection(ws) {
        boardhouseBack.boardhouseSocket = ws;
        console.log("player connected");
        boardhouseBack.connections++;

        ws.on("message", function incoming(message) {
            console.log("received: %s", message);
            const playerMessage: PlayerMessage = JSON.parse(message.toString());
            boardhouseBack.messagesToProcess.push(playerMessage);
        });

        ws.on("close", function() {
            console.log("player disconnected");
            boardhouseBack.connections--;
        })
    });
}