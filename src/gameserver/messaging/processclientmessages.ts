import { ClientInputTypes, ClientInputMessage, ClientMessageAttack, ClientMessageDownKeyDown, ClientMessageDownKeyUp, ClientMessageLeftKeyDown, ClientMessageLeftKeyUp, ClientMessageRightKeyDown, ClientMessageRightKeyUp, ClientMessageUpKeyDown, ClientMessageUpKeyUp } from "../../packets/clientinputmessage";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";
import { MessageTypes } from "../../packets/message";
import { QueriedInput } from "../serverengine/interfaces";
import { ClientWorldMessage, ClientWorldEventTypes, ClientMessagePlayerWorldTransition, ClientMessagePlayerWorldJoin, ClientMessageSpectatorWorldJoin } from "../../packets/clientworldmessage";
import { PlayerStates } from "../components/player";
import { processPlayerWorldJoinMessage, processPlayerWorldTransitionMessage, processSpectatorWorldJoinMessage } from "./processclientworldmessages";

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
    const world = server.worldEngines.find(worldEngine => worldEngine.worldType === message.data.worldType);
    const ents = world.getEntitiesByKey<Entity>("player");

    switch (message.inputType) {
        case ClientInputTypes.ATTACK:
            queryAttackInputMessage(message as ClientMessageAttack, server);
            break;
        case ClientInputTypes.LEFT_KEY_DOWN:
            processLeftKeyDownMessage(ents, message as ClientMessageLeftKeyDown);
            break;
        case ClientInputTypes.LEFT_KEY_UP:
            processLeftKeyUpMessage(ents, message as ClientMessageLeftKeyUp);
            break;
        case ClientInputTypes.RIGHT_KEY_DOWN:
            processRightKeyDownMessage(ents, message as ClientMessageRightKeyDown);
            break;
        case ClientInputTypes.RIGHT_KEY_UP:
            processRightKeyUpMessage(ents, message as ClientMessageRightKeyUp);
            break;
        case ClientInputTypes.UP_KEY_DOWN:
            processUpKeyDownMessage(ents, message as ClientMessageUpKeyDown);
            break;
        case ClientInputTypes.UP_KEY_UP:
            processUpKeyUpMessage(ents, message as ClientMessageUpKeyUp);
            break;
        case ClientInputTypes.DOWN_KEY_DOWN:
            processDownKeyDownMessage(ents, message as ClientMessageDownKeyDown);
            break;
        case ClientInputTypes.DOWN_KEY_UP:
            processDownKeyUpMessage(ents, message as ClientMessageDownKeyUp);
            break;
    }
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
        worldType: message.data.worldType,
        clientId: message.data.clientId,
    }
    server.queriedInputs.push(quieredAttackInput);
}

function processAttackInputMessage(playerEnt: Entity) {
    playerEnt.control.attack = true;
}

function processLeftKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageLeftKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.left = true;
            }
        }
    });
}

function processLeftKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageLeftKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.left = false;
            }
        }
    });
}

function processRightKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageRightKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.right = true;
            }
        }
    });
}

function processRightKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageRightKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.right = false;
            }
        }
    });
}

function processUpKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageUpKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.up = true;
            }
        }
    });
}

function processUpKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageUpKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.up = false;
            }
        }
    });
}

function processDownKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageDownKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.down = true;
            }
        }
    });
}

function processDownKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageDownKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.down = false;
            }
        }
    });
}