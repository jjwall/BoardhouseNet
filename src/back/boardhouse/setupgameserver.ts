import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { EntityMessage } from "../../packets/entitymessage";

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
            // boardhouseBack.boardhouseServer.clients.forEach(client => {
            //     let msg: EventMessage = {
            //         eventType: "createEntity",
            //         data: boardhouseBack.netIdToEntityMap[1]
            //         //     pos: {
            //         //         x: 5,
            //         //         y: 5,
            //         //     }
            //         // }
            //     };
            //     console.log(msg);
            //     client.send(JSON.stringify(msg));
            // })
        }, 5000);
    });
}