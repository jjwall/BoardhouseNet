import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { setUpClientToLobbyConnection } from "./setupclienttolobbyconnection";
import { setUpGameServer } from "./setupgameserver";
import { last } from "./helpers";
import { BaseState } from "./basestate";
import { GameState } from "../states/gameplay/gamestate";

// Consider: making this a singleton
// Consider: not doing stack popping to ensure state stability (trying to disconnect a player that exists in a different state)
// Handle client to lobby server connection.
const boardhouseBack: IBoardhouseBack = {
    clientConnection: new WebSocket("ws://localhost:8080/", { origin: "localhost:8080"}), // lobby client connection
    gameServerPort: process.argv[2],
    playerClientIds: [],
    spectatorClientIds: [],
    boardhouseSocket: <WebSocket> null, // prob don't need
    boardhouseServer: <WebSocket.Server> null,
    currentNetId: 0,
    netIdToEntityMap: {},
    messagesToProcess: [],
    stateStack: [],
    // entityChangeList: []
}

setUpClientToLobbyConnection(boardhouseBack);

setUpGameServer(boardhouseBack);

main();

function main() {
    // initialize state stack
    let mainMenuState = new GameState(boardhouseBack.stateStack, boardhouseBack);
    boardhouseBack.stateStack.push(mainMenuState);

    // logic update loop
    setInterval(function (): void {
        if (boardhouseBack.stateStack.length > 0) {
            // call update on last element in state stack
            last(boardhouseBack.stateStack).update();
        }
        else {
            throw "No states to update";
        }
    }, 16);
}