import { MessageTypes } from "../../packets/messages/message";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";
import { 
    processDownKeyDownMessage, 
    processDownKeyUpMessage, 
    processLeftKeyDownMessage, 
    processLeftKeyUpMessage, 
    processRightKeyDownMessage, 
    processRightKeyUpMessage, 
    processUpKeyDownMessage, 
    processUpKeyUpMessage, 
    queryInputMessage }
from "./processclientinputmessages";
import { 
    ClientInputTypes, 
    ClientInputMessage, 
    ClientMessageDownKeyDown, 
    ClientMessageDownKeyUp, 
    ClientMessageLeftKeyDown, 
    ClientMessageLeftKeyUp, 
    ClientMessageRightKeyDown, 
    ClientMessageRightKeyUp, 
    ClientMessageUpKeyDown,
    ClientMessageUpKeyUp } 
from "../../packets/messages/clientinputmessage";
import { 
    ClientWorldMessage, 
    ClientWorldEventTypes, 
    ClientMessagePlayerWorldTransition, 
    ClientMessagePlayerWorldJoin, 
    ClientMessageSpectatorWorldJoin } 
from "../../packets/messages/clientworldmessage";
import { 
    processPlayerWorldJoinMessage, 
    processPlayerWorldTransitionMessage, 
    processSpectatorWorldJoinMessage }
from "./processclientworldmessages";

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
        case ClientInputTypes.SKILL_ONE_PRESS:
        case ClientInputTypes.SKILL_ONE_RELEASE:
        case ClientInputTypes.SKILL_TWO_PRESS:
        case ClientInputTypes.SKILL_TWO_RELEASE:
        case ClientInputTypes.DODGE_KEY_PRESS:
            queryInputMessage(message, server);
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