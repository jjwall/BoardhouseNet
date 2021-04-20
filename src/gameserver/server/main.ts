import * as WebSocket from "ws";
import { setUpClientToLobbyConnection } from "./setupclienttolobbyconnection";
import { setUpGameServer } from "./setupgameserver";
import { last } from "./helpers";
import { BaseState } from "./basestate";
import { GameState } from "../states/gameplay/gamestate";
import { Server, ServerConfig } from "./server";

// Server to-do:
// 1. Fix BaseState ecs registration - only global and control registering.. others throwing errors - need to debug
// 2. Need to refactor engine code to reflect current changes in BoardhouseTS repo.
// 3. Need to implement UPDATE event.
// 4. Need to implement NetToEntity map
// 5. Need to implement entity change list to loop through and update ents in batch at end of engine tick
// 6. ...

// Handle client to lobby server connection.
const config: ServerConfig = {
    clientConnection: new WebSocket("ws://localhost:8080/", { origin: "localhost:8080"}), // lobby client connection
    gameServerPort: process.argv[2],
}

const server = new Server(config);

setUpClientToLobbyConnection(server);

setUpGameServer(server);

main();

function main() {
    // initialize state stack
    server.currentState = new GameState(server);

    // logic update loop
    setInterval(function (): void {
        if (server.currentState) {
            // call update on last element in state stack
            server.currentState.update();
        }
        else {
            throw "No state to update";
        }
    }, 16);
}