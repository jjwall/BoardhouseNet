import * as WebSocket from 'ws';
import { GameServerInfo } from "./../../packets/gameserverinfo";

// Consider: making this a singleton
const globalBoardhouse = {
    connection: new WebSocket('ws://localhost:8080/', { origin: 'localhost:8080'}),
    gameServerPort: process.argv[2],
    connections: 0
}

globalBoardhouse.connection.onopen = function() {
    console.log("New Game Server connection opened");
}

globalBoardhouse.connection.onmessage = function(messageEvent: WebSocket.MessageEvent) {
    const jsonData = messageEvent.data;

    if (jsonData == "get connections") {
        const gameServerData: GameServerInfo = {
            port: globalBoardhouse.gameServerPort,
            connections: 3
        }

        globalBoardhouse.connection.send(JSON.stringify(gameServerData));
    }
}

const wss = new WebSocket.Server({ port: Number(globalBoardhouse.gameServerPort) });

wss.on('connection', function connection(ws) {
    console.log("player connected");
    globalBoardhouse.connections++;

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
  
    ws.send('something');
});