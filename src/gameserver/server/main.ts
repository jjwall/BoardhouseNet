import * as WebSocket from "ws";
import { setUpClientToLobbyConnection } from "./setupclienttolobbyconnection";
import { setUpGameServer } from "./setupgameserver";
import { last } from "./helpers";
import { BaseState } from "./basestate";
import { GameState } from "../states/gameplay/gamestate";
import { Server, ServerConfig } from "./server";

// Consider: making this a singleton
// Consider: not doing stack popping to ensure state stability (trying to disconnect a player that exists in a different state)
// Handle client to lobby server connection.
const config: ServerConfig = {
    clientConnection: new WebSocket("ws://localhost:8080/", { origin: "localhost:8080"}), // lobby client connection
    gameServerPort: process.argv[2],
    playerClientIds: [],
    spectatorClientIds: [],
    boardhouseServer: <WebSocket.Server> null,
    currentNetId: 0,
    netIdToEntityMap: {},
    // messagesToProcess: [],
}

const server = new Server(config);

setUpClientToLobbyConnection(server);

setUpGameServer(server);

main();

function main() {
    // initialize state stack
    let mainMenuState = new GameState(server.stateStack, server);
    server.stateStack.push(mainMenuState);
    console.log(server.stateStack.length);
    last(server.stateStack).update();

    // logic update loop
    setInterval(function (): void {
        console.log("hi2");
        if (server.stateStack.length > 0) {
            // call update on last element in state stack
            last(server.stateStack).update();
        }
        else {
            throw "No states to update";
        }
    }, 16);
}