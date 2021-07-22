import { Entity } from "../serverengine/entity";
import { ClientInputMessage } from "../../packets/clientinputmessage";
import { sendCreateEntitiesMessage, sendLoadWorldMessage } from "./sendmessages";
import { Server } from "../serverengine/server";
import { MessageTypes } from "../../packets/message";
import { ClientInputTypes } from "../../packets/clientinputtypes";
import { PlayerClassTypes } from "../../packets/playerclasstypes";
import { createPage } from "../archetypes/page";
import { createMagician } from "../archetypes/magician";
import { createArcher } from "../archetypes/archer";
import { PositionComponent, setPosition } from "../components/position";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { QueriedInput } from "../serverengine/interfaces";
import { ClientWorldMessage, ClientWorldEventTypes, ClientMessagePlayerWorldTransition, ClientMessagePlayerWorldJoin, ClientMessageSpectatorWorldJoin } from "../../packets/clientworldmessage";
import { PlayerStates } from "../components/player";

export function processClientMessages(server: Server) {
    server.messagesToProcess.forEach(message => {
        switch (message.messageType) {
            case MessageTypes.CLIENT_INPUT_MESSAGE:
                processClientInputMessage(message as ClientInputMessage, server);
                break;
            case MessageTypes.CLIENT_WORLD_MESSAGE:
                processClientWorldMessages(message as ClientWorldMessage, server);
                break
        }
    });

    server.messagesToProcess = [];
}

function processClientWorldMessages(message: ClientWorldMessage, server: Server) {
    switch (message.eventType) {
        case ClientWorldEventTypes.PLAYER_WORLD_JOIN:
            processPlayerWorldJoinMessage(message as ClientMessagePlayerWorldJoin, server);
            break;
        case ClientWorldEventTypes.PLAYER_WORLD_TRANSITION:
            processPlayerWorldTransitionMessage(message as ClientMessagePlayerWorldTransition, server);
            break;
        case ClientWorldEventTypes.SPECTATOR_WORLD_JOIN:
            processSpectatorWorldJoinMessage(message as ClientMessageSpectatorWorldJoin, server);
            break;
        // case ClientWorldEventTypes.SPECTATOR_WORLD_TRANSITION:
        //     processSpectatorWorldTransitionMessage(message as ClientMessageSpectatorWorldTransition, server);
        //     break;

    }
}

function processClientInputMessage(message: ClientInputMessage, server: Server) {
    const world = server.worldEngines.find(worldEngine => worldEngine.worldType === message.worldType);
    const ents = world.getEntitiesByKey<Entity>("player");

    switch (message.inputType) {
        case ClientInputTypes.ATTACK:
            queryAttackInputMessage(message, server);
            break;
        case ClientInputTypes.LEFT_KEY_DOWN:
            processLeftKeyDownMessage(ents, message);
            break;
        case ClientInputTypes.LEFT_KEY_UP:
            processLeftKeyUpMessage(ents, message);
            break;
        case ClientInputTypes.RIGHT_KEY_DOWN:
            processRightKeyDownMessage(ents, message);
            break;
        case ClientInputTypes.RIGHT_KEY_UP:
            processRightKeyUpMessage(ents, message);
            break;
        case ClientInputTypes.UP_KEY_DOWN:
            processUpKeyDownMessage(ents, message);
            break;
        case ClientInputTypes.UP_KEY_UP:
            processUpKeyUpMessage(ents, message);
            break;
        case ClientInputTypes.DOWN_KEY_DOWN:
            processDownKeyDownMessage(ents, message);
            break;
        case ClientInputTypes.DOWN_KEY_UP:
            processDownKeyUpMessage(ents, message);
            break;
    }
}

function processPlayerWorldTransitionMessage(message: ClientMessagePlayerWorldTransition, server: Server) {
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
        sendCreateEntitiesMessage(clientWorld.getEntitiesByKey<Entity>("global"), server, message.data.newWorldType);
        playerEnt.player.state = PlayerStates.LOADED;
    }, 5000);
}

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
        sendCreateEntitiesMessage(clientWorld.getEntitiesByKey<Entity>("global"), server, message.data.worldType);
        playerEnt.player.state = PlayerStates.LOADED;
    }, 5000);

    // TODO: Loop through NetIdToEnt map and send a bunch of Create Entity messages
}

// TODO: Give spectators the abilities to control camera / follow players / swap worlds etc.
function processSpectatorWorldJoinMessage(message: ClientMessageSpectatorWorldJoin, server: Server) {
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
        sendCreateEntitiesMessage(clientWorld.getEntitiesByKey<Entity>("global"), server, message.data.worldType);
    }, 5000);
}

// TRY TO REDUCE THIS TO BIG O OF N and not N^2
// An alternative approach would be to make a table for players... but a small list for now will do.
export function processQueriedInputs(server: Server) {
    server.queriedInputs.forEach(input => {
        const currentWorld = server.worldEngines.find(worldEngine => worldEngine.worldType === input.worldType);
        const ents = currentWorld.getEntitiesByKey<Entity>("player");

        ents.forEach(ent => {
            if (ent.player && ent.control) {
                if (ent.player.id === input.clientId && ent.player.state === PlayerStates.LOADED) {
                    switch (input.inputType) {
                        case ClientInputTypes.ATTACK:
                            processAttackInputMessage(ent);
                            break;
                        // case ...
                    }
                }
            }
        });
    });

    // Clear queriedInputs list.
    server.queriedInputs = [];
}

function queryAttackInputMessage(message: ClientInputMessage, server: Server) {
    const quieredAttackInput: QueriedInput = {
        inputType: message.inputType,
        worldType: message.worldType,
        clientId: message.clientId,
    }
    server.queriedInputs.push(quieredAttackInput);
}

function processAttackInputMessage(playerEnt: Entity) {
    playerEnt.control.attack = true;
}

function processLeftKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.left = true;
            }
        }
    });
}

function processLeftKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.left = false;
            }
        }
    });
}

function processRightKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.right = true;
            }
        }
    });
}

function processRightKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.right = false;
            }
        }
    });
}

function processUpKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.up = true;
            }
        }
    });
}

function processUpKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.up = false;
            }
        }
    });
}

function processDownKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.down = true;
            }
        }
    });
}

function processDownKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.down = false;
            }
        }
    });
}