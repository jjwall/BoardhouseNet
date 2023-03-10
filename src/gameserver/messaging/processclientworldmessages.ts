import { ClientMessagePlayerWorldTransition, ClientMessagePlayerWorldJoin, ClientMessageSpectatorWorldJoin, ClientMessagePlayerInventoryEvent, ClientMessagePlayerChatMessage } from "../../packets/messages/clientworldmessage";
import { broadcastPlayerChatMessage, sendLoadWorldMessage, sendPlayerReconcileInventoryMessage } from "./sendnetworldmessages";
import { createPlayerCharacter, PlayerCharacterParams } from "../archetypes/playercharacter";
import { findPlayerEntityByClientId, processPlayerEquipEvent } from "./helpers";
import { presetKnightInventory } from "../../database/inventory/preset_knightinventory";
import { presetRangerInventory } from "../../database/inventory/preset_rangerinventory";
import { presetWizardInventory } from "../../database/inventory/preset_wizardinventory";
import { presetPageInventory } from "../../database/inventory/preset_pageinventory";
import { broadcastCreateEntitiesMessage } from "./sendnetentitymessages";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { presetKnightStats } from "../../database/stats/preset_knightstats";
import { presetWizardStats } from "../../database/stats/preset_wizardstats";
import { presetRangerStats } from "../../database/stats/preset_rangerstats";
import { presetPageStats } from "../../database/stats/preset_pagestats";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setPosition } from "../components/position";
import { PlayerStates } from "../components/player";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";

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
    
    let playerEntParams: PlayerCharacterParams = {
        worldEngine: clientWorld,
        clientId: message.data.clientId,
        spawnPos: undefined,
        class: message.data.playerClass,
        currentInventory: undefined,
        currentStats: undefined,
    }

    // Preset inventory and statsbased on chosen class. 
    // This happens outside of playerCharacter archetype since inventory and stats will change when players transition worlds.
    switch (message.data.playerClass) {
        case PlayerClassTypes.PAGE:
            playerEntParams.spawnPos = setPosition(0, 0, 5);
            playerEntParams.currentInventory = presetPageInventory;
            playerEntParams.currentStats = presetPageStats;
            break;
        case PlayerClassTypes.WIZARD:
            playerEntParams.spawnPos = setPosition(0, 0, 5);
            playerEntParams.currentInventory = presetWizardInventory;
            playerEntParams.currentStats = presetWizardStats;
            break;
        case PlayerClassTypes.RANGER:
            playerEntParams.spawnPos = setPosition(0, 0, 5);
            playerEntParams.currentInventory = presetRangerInventory;
            playerEntParams.currentStats = presetRangerStats;
            break;
        case PlayerClassTypes.KNIGHT:
            playerEntParams.spawnPos = setPosition(0, 0, 5);
            playerEntParams.currentInventory = presetKnightInventory;
            playerEntParams.currentStats = presetKnightStats;
            break;
    }

    // Override preset name field if username is set.
    if (message.data.username.length > 0) {
        playerEntParams.currentStats.name = message.data.username;
    }

    playerEnt = createPlayerCharacter(playerEntParams)

    // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        // Create all entities for connecting client.
        sendLoadWorldMessage(server, clientWorld.worldLevelData, message.data.clientId);
        broadcastCreateEntitiesMessage(clientWorld.getEntitiesByKey<Entity>("global"), server, message.data.worldType);
        sendPlayerReconcileInventoryMessage(server, playerEnt.player.inventory, message.data.clientId);
        playerEnt.player.state = PlayerStates.LOADED;
    }, 5000);
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

    const params: PlayerCharacterParams = {
        worldEngine: clientWorld,
        clientId: message.data.clientId,
        spawnPos: setPosition(message.data.newPos.x, message.data.newPos.y, 5),
        class: message.data.playerClass,
        currentInventory: message.data.playerInventory,
        currentStats: message.data.playerStats,
    }
    playerEnt = createPlayerCharacter(params)

    // Not exactly sure why we need this setTimeout here.
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

export function processPlayerInventoryEventMessage(message: ClientMessagePlayerInventoryEvent, server: Server) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.data.clientId}" sent an inventory event.`)

    let clientWorld: BaseWorldEngine;

    try {
        clientWorld = server.worldEngines.find(worldEngine => worldEngine.worldType === message.data.worldType);
    } catch {
        throw Error("unable to find world");
    }

    const playerEnt = findPlayerEntityByClientId(clientWorld, message.data.clientId)

    processPlayerEquipEvent(playerEnt, message.data.inventory, clientWorld)
}

export function processPlayerChatMessage(message: ClientMessagePlayerChatMessage, server: Server) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.data.clientId}" sent a chat message.`)

    broadcastPlayerChatMessage(server, message.data);
}