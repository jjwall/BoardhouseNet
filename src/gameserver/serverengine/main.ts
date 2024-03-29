import { setUpClientToLobbyConnection } from "./setupclienttolobbyconnection";
import { ItemShopWorldEngine } from "../worlds/itemshop/itemshopworldengine";
import { CastleWorldEngine } from "../worlds/castle/castleworldengine";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { setUpGameServer } from "./setupgameserver";
import { Server, ServerConfig } from "./server";
import * as WebSocket from "ws";
import { Forest_1_1 } from "../worlds/forest/forest_1_1";

// Server to-do:
// 1. (done) Fix BaseState ecs registration - only global and control registering.. others throwing errors - need to debug
// 2. Need to refactor engine code to reflect current changes in BoardhouseTS repo.
// 3. (done) Queue up attacking events (not like movement)
// -> To be processed as a tap so if tick misses it'll register on next tick
// 3. (done) Need to implement UPDATE event.
// 4. (done) Need to implement NetToEntity map
// 5. (done) Need to implement entity change list to loop through and update ents in batch at end of engine tick
// 6. (done) client player's ents should have +1 to their z-index so they are always rendered over other player's ents
// 7. (done) Refactor "sendmessages.ts" - should be split into "sendnetnentitymessages.ts" and "sendneteventmessages.ts"
// -> (done) same story for "processclientmessages.ts"

// Handle client to lobby server connection.
const config: ServerConfig = {
    clientConnection: new WebSocket("ws://localhost:8080/", { origin: "localhost:8080"}), // lobby client connection
    gameServerPort: process.argv[2],
    gameTicksPerSecond: 20,
}

const server = new Server(config);

setUpClientToLobbyConnection(server);

setUpGameServer(server);

main();

function main() {
    // initialize state stack
    server.worldEngines.push(new CastleWorldEngine(server, WorldTypes.CASTLE));
    server.worldEngines.push(new ItemShopWorldEngine(server, WorldTypes.ITEM_SHOP));
    server.worldEngines.push(new Forest_1_1(server, WorldTypes.FOREST_1_1));

    // logic update loop
    setInterval(function (): void {
        if (server.worldEngines.length > 0) {
            // call update on last element in state stack
            server.update();
            server.worldEngines.forEach(worldEngine => worldEngine.update());
        }
        else {
            throw "No state to update";
        }
    }, server.millisecondsPerGameTick);
}