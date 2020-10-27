import * as WebSocket from "ws";
import { IBoardhouseBack } from "./interfaces";
import { setUpClientToLobbyConnection } from "./setupclienttolobbyconnection";
import { setUpGameServer } from "./setupgameserver";
import { last } from "./helpers";
import { BaseState } from "./basestate";
import { GameState } from "../states/gameplay/gamestate";

// Consider: making this a singleton
// Handle client to lobby server connection.
const boardhouseBack: IBoardhouseBack = {
    clientConnection: new WebSocket("ws://localhost:8080/", { origin: "localhost:8080"}),
    gameServerPort: process.argv[2],
    connections: 0,
    boardhouseSocket: <WebSocket> null, // prob don't need
    boardhouseServer: <WebSocket.Server> null,
    currentNetId: 0,
    netIdToEntityMap: {},
    messagesToProcess: [],
    // entityChangeList: []
}

setUpClientToLobbyConnection(boardhouseBack);

setUpGameServer(boardhouseBack);

main();

function main() {
    // initialize state stack
    let stateStack: BaseState[] = [];
    let mainMenuState = new GameState(stateStack, boardhouseBack);
    stateStack.push(mainMenuState);

    // logic update loop
    setInterval(function (): void {
        if (stateStack.length > 0) {
            // call update on last element in state stack
            last(stateStack).update();
        }
        else {
            throw "No states to update";
        }
    }, 16);
}