import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { setUpClientToLobbyConnection } from "./setupclienttolobbyconnection";
import { setUpGameServer } from "./setupgameserver";

// Consider: making this a singleton
// Handle client to lobby server connection.
const boardhouseBack: IBoardhouseBack = {
    connection: new WebSocket("ws://localhost:8080/", { origin: "localhost:8080"}),
    gameServerPort: process.argv[2],
    connections: 0
}

setUpClientToLobbyConnection(boardhouseBack);

setUpGameServer(boardhouseBack);