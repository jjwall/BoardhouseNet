console.log("engine files go here");
console.log("handle process.argv arguments");
console.log("listen on port: " + process.argv[2]);
import * as WebSocket from 'ws';
import { GameServerInfo } from "./../../packets/gameserverinfo";

const globalBoardhouse = {
    connection: new WebSocket('ws://localhost:8080/', { origin: 'localhost:8080'})
}

globalBoardhouse.connection.onopen = function() {
    console.log("opened connection");
}

globalBoardhouse.connection.onmessage = function(messageEvent: WebSocket.MessageEvent) {
    const jsonData = messageEvent.data;
    console.log(messageEvent.data);

    if (jsonData == "get connections") {
        const gameServerData: GameServerInfo = {
            port: "9001",
            connections: 3
        }
        globalBoardhouse.connection.send(JSON.stringify(gameServerData));
    }
}