console.log("engine files go here");
console.log("handle process.argv arguments");
console.log("listen on port: " + process.argv[2]);
import * as WebSocket from 'ws';
import { GameServerInfo } from "./../../packets/gameserverinfo";

const connection = new WebSocket('ws://localhost:8080/');

connection.onopen = function() {
    console.log("opened connection");
}

connection.onmessage = function(messageEvent) {
    const jsonData = messageEvent.data;
    console.log(messageEvent);

    if (jsonData === "get connections") {
        const gameServerData: GameServerInfo = {
            port: "5000",
            connections: 3
        }
        connection.send(gameServerData);
    }
}