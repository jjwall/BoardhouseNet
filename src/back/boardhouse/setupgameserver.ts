import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { EntityMessage } from "../../packets/entitymessage";
import { sendCreateOrUpdateEntityMessage } from "./sendmessages";
import { Entity } from "./entity";

export function setUpGameServer(boardhouseBack: IBoardhouseBack) {
    boardhouseBack.boardhouseServer = new WebSocket.Server({ port: Number(boardhouseBack.gameServerPort) });

    boardhouseBack.boardhouseServer.on("connection", function connection(ws) {
        boardhouseBack.boardhouseSocket = ws;
        console.log("player connected");
        boardhouseBack.connections++;

        ws.on("message", function incoming(message) {
            console.log("received: %s", message);
        });

        ws.on("close", function() {
            console.log("player disconnected");
            boardhouseBack.connections--;
        })

        // Should be able to update clients without setTimeout
        // on "open" doesn't work either
        setTimeout(function() {
            // test ent... WOULD NEVER CREATE AN ENTITY HERE, need to register and all that
            let ent = new Entity();
            ent.netId = 1;
            ent.anim = { sequence: "idle", currentFrame: 0 };
            ent.sprite = { url: "blah", pixelRatio: 4 };
            ent.pos = { x: 5, y: 5};

            sendCreateOrUpdateEntityMessage(ent, boardhouseBack);
        }, 5000);
    });
}