import { Entity } from "../states/gameplay/entity";
import { GameState } from "../states/gameplay/gamestate";
import { ClientEventMessage } from "../../packets/clienteventmessage";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { ClientInputMessage } from "../../packets/clientinputmessage";
import { initializeControls } from "../components/initializers";
import { sendCreateEntitiesMessage } from "./sendmessages";
import { Server } from "../server/server";
import { MessageTypes } from "../../packets/messagetypes";
import { ClientInputTypes } from "../../packets/clientinputtypes";
import { PlayerClassTypes } from "../../packets/playerclasstypes";
import { createPage } from "../archetypes/page";
import { PositionComponent } from "../components/corecomponents";
import { createMagician } from "../archetypes/magician";
import { createArcher } from "../archetypes/archer";

// Will need more info pertaining to INPUT_TO_QUERY event.
export function processClientMessages(ents: ReadonlyArray<Entity>, server: Server, state: GameState) {
    server.messagesToProcess.forEach(message => {
        switch (message.messageType) {
            case MessageTypes.CLIENT_EVENT_MESSAGE:
                processClientEventMessage(message as ClientEventMessage, ents, server, state);
                break;
            case MessageTypes.CLIENT_INPUT_MESSAGE:
                processClientInputMessage(message as ClientInputMessage, ents, server, state);
                break;
        }
    });

    server.messagesToProcess = [];
}

function processClientEventMessage(message: ClientEventMessage, ents: ReadonlyArray<Entity>, server: Server, state: GameState) {
    switch (message.eventType) {
        case ClientEventTypes.PLAYER_JOINED:
            processPlayerJoinedMessage(message, server, state);
            break;
        case ClientEventTypes.SPECTATOR_JOINED:
            processSpectatorJoinedMessage(message, server, state);
            break;
    }
}

function processClientInputMessage(message: ClientInputMessage, ents: ReadonlyArray<Entity>, server: Server, state: GameState) {
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

/**
 * Just because player joins, doesn't mean an ent necessarily needs to be created for them.
 * In this example we do just that.
 * @param message 
 * @param server 
 * @param state 
 */
function processPlayerJoinedMessage(message: ClientEventMessage, server: Server, state: GameState) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.clientId}" joined as a player with class = "${message.playerClass}"`);
    console.log("create player entity");
    
    switch (message.playerClass) {
        case PlayerClassTypes.PAGE:
            const pagePos: PositionComponent = { x: 150, y: 150, z: 5 };
            createPage(state, message, pagePos);
            break;
        case PlayerClassTypes.MAGICIAN:
            const magicianPos: PositionComponent = { x: 150, y: 450, z: 5 };
            createMagician(state, message, magicianPos);
            break;
        case PlayerClassTypes.ARCHER:
            const archerPos: PositionComponent = { x: 150, y: 450, z: 5 };
            createArcher(state, message, archerPos);
            break;
    }

    // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        // Create all entities for connecting client.
        sendCreateEntitiesMessage(state.getEntitiesByKey<Entity>("global"), server);
    }, 5000);

    // TODO: Loop through NetIdToEnt map and send a bunch of Create Entity messages
}

function processSpectatorJoinedMessage(message: ClientEventMessage, server: Server, state: GameState) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.clientId}" joined as a spectator`);

    // Dummy data... for testing stuff with spectator
    // Set up another player entity.
    let player = new Entity();
    player.player = { id: message.clientId };
    player.pos = { x: 350, y: 150, z: 5 };
    player.sprite = { url: "./data/textures/snow.png", pixelRatio: 4 };
    player.anim = { sequence: "blah", currentFrame: 0 };
    player.control = initializeControls();

    state.registerEntity(player, server);

    // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        // Create all entities for connecting client.
        sendCreateEntitiesMessage(state.getEntitiesByKey<Entity>("global"), server);
    }, 5000);
}

// TRY TO REDUCE THIS TO BIG O OF N and not N^2
// An alternative approach would be to make a table for players... but a small list for now will do.
export function processQueriedInputs(ents: ReadonlyArray<Entity>, server: Server, state: GameState) {
    server.queriedInputs.forEach(input => {
        ents.forEach(ent => {
            if (ent.player && ent.control) {
                if (ent.player.id === input.clientId) {
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
    server.queriedInputs.push({inputType: message.inputType, clientId: message.clientId});
}

function processAttackInputMessage(playerEnt: Entity) {
    playerEnt.control.attack = true;
}

function processLeftKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.left = true;
            }
        }
    });
}

function processLeftKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.left = false;
            }
        }
    });
}

function processRightKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.right = true;
            }
        }
    });
}

function processRightKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.right = false;
            }
        }
    });
}

function processUpKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.up = true;
            }
        }
    });
}

function processUpKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.up = false;
            }
        }
    });
}

function processDownKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.down = true;
            }
        }
    });
}

function processDownKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientInputMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.down = false;
            }
        }
    });
}