import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";

export function setUpGameServer(boardhouseBack: IBoardhouseBack) {
    const wss = new WebSocket.Server({ port: Number(boardhouseBack.gameServerPort) });

    wss.on("connection", function connection(ws) {
        boardhouseBack.gameServerSocket = ws;
        console.log("player connected");
        boardhouseBack.connections++;

        ws.on("message", function incoming(message) {
            console.log("received: %s", message);
        });

        ws.on("close", function() {
            boardhouseBack.connections--;
        })
    
        ws.send("something");
    });
}