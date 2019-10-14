import * as WebSocket from 'ws';
import { GameServerInfo } from "./../../packets/gameserverinfo";

// Consider: making this a singleton
// Handle client to lobby server connection.
const boardhouseBack = {
    connection: new WebSocket('ws://localhost:8080/', { origin: 'localhost:8080'}),
    gameServerPort: process.argv[2],
    connections: 0
}

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

// Set up game server.
const wss = new WebSocket.Server({ port: Number(boardhouseBack.gameServerPort) });

wss.on('connection', function connection(ws) {
    console.log("player connected");
    boardhouseBack.connections++;

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
  
    ws.send('something');
});