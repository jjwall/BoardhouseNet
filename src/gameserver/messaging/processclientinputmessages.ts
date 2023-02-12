import { QueriedInput } from "../serverengine/interfaces";
import { PlayerStates } from "../components/player";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";
import { 
    ClientInputMessage,
    ClientInputTypes, 
    ClientMessageDownKeyDown, 
    ClientMessageDownKeyUp, 
    ClientMessageLeftKeyDown, 
    ClientMessageLeftKeyUp, 
    ClientMessageRightKeyDown, 
    ClientMessageRightKeyUp, 
    ClientMessageUpKeyDown,
    ClientMessageUpKeyUp } 
from "../../packets/messages/clientinputmessage";

export function queryInputMessage(message: ClientInputMessage, server: Server) {
    const quieredInput: QueriedInput = {
        inputType: message.inputType,
        worldType: message.data.worldType,
        clientId: message.data.clientId,
    }
    server.queriedInputs.push(quieredInput);
}

export function processSkillOnePressInputMessage(playerEnt: Entity) {
    const skillOne = playerEnt?.skillSlots?.getSkillOne()

    if (skillOne)
        skillOne.triggerPressAction = true
}

export function processSkillOneReleaseInputMessage(playerEnt: Entity) {
    const skillOne = playerEnt?.skillSlots?.getSkillOne()

    if (skillOne)
        skillOne.triggerReleaseAction = true
}

export function processSkillTwoPressInputMessage(playerEnt: Entity) {
    const skillTwo = playerEnt?.skillSlots?.getSkillTwo()

    if (skillTwo)
        skillTwo.triggerPressAction = true
}

export function processSkillTwoReleaseInputMessage(playerEnt: Entity) {
    const skillTwo = playerEnt?.skillSlots?.getSkillTwo()

    if (skillTwo)
        skillTwo.triggerReleaseAction = true
}

export function processDodgeKeyPressMessage(playerEnt: Entity) {
    if (!playerEnt?.movement?.dodgeRolling) {
        playerEnt.movement.stutterTicks = 10
        playerEnt.movement.dodgeRolling = true
    }
}

export function processLeftKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageLeftKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.movement) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.movement.left = true;
            }
        }
    });
}

export function processLeftKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageLeftKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.movement) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.movement.left = false;
            }
        }
    });
}

export function processRightKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageRightKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.movement) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.movement.right = true;
            }
        }
    });
}

export function processRightKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageRightKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.movement) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.movement.right = false;
            }
        }
    });
}

export function processUpKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageUpKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.movement) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.movement.up = true;
            }
        }
    });
}

export function processUpKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageUpKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.movement) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.movement.up = false;
            }
        }
    });
}

export function processDownKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessageDownKeyDown) {
    ents.forEach(ent => {
        if (ent.player && ent.movement) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.movement.down = true;
            }
        }
    });
}

export function processDownKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessageDownKeyUp) {
    ents.forEach(ent => {
        if (ent.player && ent.movement) {
            if (ent.player.id === message.data.clientId && ent.player.state === PlayerStates.LOADED) {
                ent.movement.down = false;
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
            if (ent.player && ent.movement) { // && ent.skillSlots
                if (ent.player.id === input.clientId && ent.player.state === PlayerStates.LOADED) {
                    switch (input.inputType) {
                        case ClientInputTypes.SKILL_ONE_PRESS:
                            processSkillOnePressInputMessage(ent);
                            break;
                        case ClientInputTypes.SKILL_ONE_RELEASE:
                            processSkillOneReleaseInputMessage(ent);
                            break;
                        case ClientInputTypes.SKILL_TWO_PRESS:
                            processSkillTwoPressInputMessage(ent);
                            break;
                        case ClientInputTypes.SKILL_TWO_RELEASE:
                            processSkillTwoReleaseInputMessage(ent);
                            break;
                        case ClientInputTypes.DODGE_KEY_PRESS:
                            processDodgeKeyPressMessage(ent)
                            break;
                    }
                }
            }
        });
    });

    // Clear queriedInputs list.
    server.queriedInputs = [];
}