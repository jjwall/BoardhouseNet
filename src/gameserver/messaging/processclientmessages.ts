import { Entity } from "../serverengine/entity";
import { ClientEventMessage } from "../../packets/clienteventmessage";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { ClientInputMessage } from "../../packets/clientinputmessage";
import { sendCreateEntitiesMessage, sendLoadWorldMessage } from "./sendmessages";
import { Server } from "../serverengine/server";
import { MessageTypes } from "../../packets/messagetypes";
import { ClientInputTypes } from "../../packets/clientinputtypes";
import { PlayerClassTypes } from "../../packets/playerclasstypes";
import { createPage } from "../archetypes/page";
import { createMagician } from "../archetypes/magician";
import { createArcher } from "../archetypes/archer";
import { PositionComponent, setPosition } from "../components/position";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { QueriedInput } from "../serverengine/interfaces";
import { ClientWorldMessage, ClientWorldEventTypes } from "../../packets/clientworldmessage";
import { WorldTransitionData } from "../../packets/worldtransitiondata";
import { PlayerStates } from "../components/player";

// Will need more info pertaining to INPUT_TO_QUERY event.
export function processClientMessages(server: Server) {
    server.messagesToProcess.forEach(message => {
        switch (message.messageType) {
            case MessageTypes.CLIENT_EVENT_MESSAGE:
                processClientEventMessage(message as ClientEventMessage, server);
                break;
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
    switch (message.eventTypes) {
        case ClientWorldEventTypes.PLAYER_WORLD_TRANSITION:
            processPlayerWorldTransitionMessage(message.data, server);
            break
    }
}

function processClientEventMessage(message: ClientEventMessage, server: Server) {
    switch (message.eventType) {
        case ClientEventTypes.PLAYER_JOINED:
            processPlayerJoinedMessage(message, server);
            break;
        case ClientEventTypes.SPECTATOR_JOINED:
            // processSpectatorJoinedMessage(message, server, state);
            break;
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

function processPlayerWorldTransitionMessage(data: WorldTransitionData, server: Server) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${data.clientId}" transitioned as a player with class = "${data.playerClass}" in world = "${data.newWorldType}"`);
    let clientWorld: BaseWorldEngine;
    let playerEnt: Entity;

    try {
        clientWorld = server.worldEngines.find(worldEngine => worldEngine.worldType === data.newWorldType);
    } catch {
        throw Error("unable to find world");
    }
    
    switch (data.playerClass) {
        case PlayerClassTypes.PAGE:
            const pagePos: PositionComponent = setPosition(data.newPos.x, data.newPos.y, 5);
            playerEnt = createPage(server, clientWorld, data.clientId, pagePos);
            break;
        case PlayerClassTypes.MAGICIAN:
            const magicianPos: PositionComponent = setPosition(data.newPos.x, data.newPos.y, 5);
            playerEnt = createMagician(server, clientWorld, data.clientId, magicianPos);
            break;
        case PlayerClassTypes.ARCHER:
            const archerPos: PositionComponent = setPosition(data.newPos.x, data.newPos.y, 5);
            playerEnt = createArcher(server, clientWorld, data.clientId, archerPos);
            break;
    }

    // // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        // Create all entities for connecting client.
        sendLoadWorldMessage(server, clientWorld.worldLevelData, data.clientId);
        sendCreateEntitiesMessage(clientWorld.getEntitiesByKey<Entity>("global"), server, data.newWorldType);
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
export function processPlayerJoinedMessage(message: ClientEventMessage, server: Server) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.clientId}" joined as a player with class = "${message.playerClass}" in world = "${message.worldType}"`);
    console.log("create player entity");
    let clientWorld: BaseWorldEngine;
    let playerEnt: Entity;

    try {
        clientWorld = server.worldEngines.find(worldEngine => worldEngine.worldType === message.worldType);
    } catch {
        throw Error("unable to find world");
    }
    
    switch (message.playerClass) {
        case PlayerClassTypes.PAGE:
            const pagePos: PositionComponent = setPosition(150, 150, 5);
            playerEnt = createPage(server, clientWorld, message.clientId, pagePos);
            break;
        case PlayerClassTypes.MAGICIAN:
            const magicianPos: PositionComponent = setPosition(150, 450, 5);
            playerEnt = createMagician(server, clientWorld, message.clientId, magicianPos);
            break;
        case PlayerClassTypes.ARCHER:
            const archerPos: PositionComponent = setPosition(0, 0, 5);
            playerEnt = createArcher(server, clientWorld, message.clientId, archerPos);
            break;
    }

    // // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        // Create all entities for connecting client.
        sendLoadWorldMessage(server, clientWorld.worldLevelData, message.clientId);
        sendCreateEntitiesMessage(clientWorld.getEntitiesByKey<Entity>("global"), server, message.worldType);
        playerEnt.player.state = PlayerStates.LOADED;
    }, 5000);

    // TODO: Loop through NetIdToEnt map and send a bunch of Create Entity messages
}

// TODO: Make functional again.
function processSpectatorJoinedMessage(message: ClientEventMessage, server: Server, worldEngine: BaseWorldEngine) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.clientId}" joined as a spectator`);

    // Dummy data... for testing stuff with spectator
    // Set up another player entity.
    let player = new Entity();
    // player.player = { id: message.clientId };
    player.pos = setPosition(350, 150, 5);
    player.sprite = { url: "./data/textures/snow.png", pixelRatio: 4 };
    player.anim = { sequence: "blah", currentFrame: 0 };

    worldEngine.registerEntity(player, server);

    // Not exactly sure why we need this setTimeout here.
    // setTimeout(function() {
        // Create all entities for connecting client.
        // sendCreateEntitiesMessage(state.getEntitiesByKey<Entity>("global"), server);
    // }, 5000);
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