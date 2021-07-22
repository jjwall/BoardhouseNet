import { QueriedInput } from "../serverengine/interfaces";
import { PlayerStates } from "../components/player";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";
import { 
    ClientInputTypes, 
    ClientMessageAttack, 
    ClientMessageDownKeyDown, 
    ClientMessageDownKeyUp, 
    ClientMessageLeftKeyDown, 
    ClientMessageLeftKeyUp, 
    ClientMessageRightKeyDown, 
    ClientMessageRightKeyUp, 
    ClientMessageUpKeyDown,
    ClientMessageUpKeyUp } 
from "../../packets/messages/clientinputmessage";

export function queryAttackInputMessage(message: ClientMessageAttack, server: Server) {
    const quieredAttackInput: QueriedInput = {
        inputType: message.inputType,
        worldType: message.data.worldType,
        clientId: message.data.clientId,
    }
    server.queriedInputs.push(quieredAttackInput);
}

export function processAttackInputMessage(playerEnt: Entity) {
    playerEnt.control.attack = true;
}

export function processLeftKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageLeftKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.left = true;
            }
        }
    });
}

export function processLeftKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageLeftKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.left = false;
            }
        }
    });
}

export function processRightKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageRightKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.right = true;
            }
        }
    });
}

export function processRightKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageRightKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.right = false;
            }
        }
    });
}

export function processUpKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageUpKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.up = true;
            }
        }
    });
}

export function processUpKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageUpKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.up = false;
            }
        }
    });
}

export function processDownKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageDownKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.down = true;
            }
        }
    });
}

export function processDownKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageDownKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.control.down = false;
            }
        }
    });
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