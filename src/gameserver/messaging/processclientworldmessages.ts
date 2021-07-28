import { ClientMessagePlayerWorldTransition, ClientMessagePlayerWorldJoin, ClientMessageSpectatorWorldJoin } from "../../packets/messages/clientworldmessage";
import { broadcastCreateEntitiesMessage } from "./sendnetentitymessages";
import { PositionComponent, setPosition } from "../components/position";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { sendLoadWorldMessage } from "./sendnetworldmessages";
import { createMagician } from "../archetypes/magician";
import { PlayerStates } from "../components/player";
import { createArcher } from "../archetypes/archer";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";
import { createPage } from "../archetypes/page";

/**
 * Just because player joins, doesn't mean an ent necessarily needs to be created for them.
 * In this example we do just that.
 * @param message 
 * @param server 
 * @param state 
 */
 export function processPlayerWorldJoinMessage(message: ClientMessagePlayerWorldJoin, server: Server) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.data.clientId}" joined as a player with class = "${message.data.playerClass}" in world = "${message.data.worldType}"`);
    console.log("create player entity");
    let clientWorld: BaseWorldEngine;
    let playerEnt: Entity;

    try {
        clientWorld = server.worldEngines.find(worldEngine => worldEngine.worldType === message.data.worldType);
    } catch {
        throw Error("unable to find world");
    }
    
    switch (message.data.playerClass) {
        case PlayerClassTypes.PAGE:
            const pagePos: PositionComponent = setPosition(150, 150, 5);
            playerEnt = createPage(server, clientWorld, message.data.clientId, pagePos);
            break;
        case PlayerClassTypes.MAGICIAN:
            const magicianPos: PositionComponent = setPosition(150, 450, 5);
            playerEnt = createMagician(server, clientWorld, message.data.clientId, magicianPos);
            break;
        case PlayerClassTypes.ARCHER:
            const archerPos: PositionComponent = setPosition(0, 0, 5);
            playerEnt = createArcher(server, clientWorld, message.data.clientId, archerPos);
            break;
    }

    // // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        // Create all entities for connecting client.
        sendLoadWorldMessage(server, clientWorld.worldLevelData, message.data.clientId);
        broadcastCreateEntitiesMessage(clientWorld.getEntitiesByKey<Entity>("global"), server, message.data.worldType);
        playerEnt.player.state = PlayerStates.LOADED;
    }, 5000);

    // TODO: Loop through NetIdToEnt map and send a bunch of Create Entity messages
}

export function processPlayerWorldTransitionMessage(message: ClientMessagePlayerWorldTransition, server: Server) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.data.clientId}" transitioned as a player with class = "${message.data.playerClass}" in world = "${message.data.newWorldType}"`);
    let clientWorld: BaseWorldEngine;
    let playerEnt: Entity;

    try {
        clientWorld = server.worldEngines.find(worldEngine => worldEngine.worldType === message.data.newWorldType);
    } catch {
        throw Error("unable to find world");
    }
    
    switch (message.data.playerClass) {
        case PlayerClassTypes.PAGE:
            const pagePos: PositionComponent = setPosition(message.data.newPos.x, message.data.newPos.y, 5);
            playerEnt = createPage(server, clientWorld, message.data.clientId, pagePos);
            break;
        case PlayerClassTypes.MAGICIAN:
            const magicianPos: PositionComponent = setPosition(message.data.newPos.x, message.data.newPos.y, 5);
            playerEnt = createMagician(server, clientWorld, message.data.clientId, magicianPos);
            break;
        case PlayerClassTypes.ARCHER:
            const archerPos: PositionComponent = setPosition(message.data.newPos.x, message.data.newPos.y, 5);
            playerEnt = createArcher(server, clientWorld, message.data.clientId, archerPos);
            break;
    }

    // // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        // Create all entities for connecting client.
        sendLoadWorldMessage(server, clientWorld.worldLevelData, message.data.clientId);
        broadcastCreateEntitiesMessage(clientWorld.getEntitiesByKey<Entity>("global"), server, message.data.newWorldType);
        playerEnt.player.state = PlayerStates.LOADED;
    }, 2000);
}

// TODO: Give spectators the abilities to control camera / follow players / swap worlds etc.
export function processSpectatorWorldJoinMessage(message: ClientMessageSpectatorWorldJoin, server: Server) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.data.clientId}" joined as a spectator in world = "${message.data.worldType}"`);
    let clientWorld: BaseWorldEngine;

    try {
        clientWorld = server.worldEngines.find(worldEngine => worldEngine.worldType === message.data.worldType);
    } catch {
        throw Error("unable to find world");
    }

    setTimeout(function() {
        // Create all entities for connecting client.
        sendLoadWorldMessage(server, clientWorld.worldLevelData, message.data.clientId);
        broadcastCreateEntitiesMessage(clientWorld.getEntitiesByKey<Entity>("global"), server, message.data.worldType);
    }, 5000);
}