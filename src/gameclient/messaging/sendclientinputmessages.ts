import { ClientInputMessage } from "../../packets/clientinputmessage";
import { ClientInputTypes } from "../../packets/clientinputtypes";
import { WorldTypes } from "../../packets/worldtypes";
import { MessageTypes } from "../../packets/messagetypes";
import { Client } from "../clientengine/client";

// Left movement key:
export function sendLeftKeyDownMessage(client: Client) {
    const message: ClientInputMessage  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.LEFT_KEY_DOWN,
        clientId: client.currentClientId,
        worldType: client.worldType,
    }

    client.connection.send(JSON.stringify(message));
}

export function sendLeftKeyUpMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.LEFT_KEY_UP,
        clientId: client.currentClientId,
        worldType: client.worldType,
    }
    
    client.connection.send(JSON.stringify(message));
}

// Right movement key:
export function sendRightKeyDownMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.RIGHT_KEY_DOWN,
        clientId: client.currentClientId,
        worldType: client.worldType,
    }     
    
    client.connection.send(JSON.stringify(message));
}

export function sendRightKeyUpMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.RIGHT_KEY_UP,
        clientId: client.currentClientId,
        worldType: client.worldType,
    }
    
    client.connection.send(JSON.stringify(message));
}

// Up movement key:
export function sendUpKeyDownMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.UP_KEY_DOWN,
        clientId: client.currentClientId,
        worldType: client.worldType,
    }     
    
    client.connection.send(JSON.stringify(message));
}

export function sendUpKeyUpMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.UP_KEY_UP,
        clientId: client.currentClientId,
        worldType: client.worldType,
    }
    
    client.connection.send(JSON.stringify(message));
}

// Down movement key:
export function sendDownKeyDownMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.DOWN_KEY_DOWN,
        clientId: client.currentClientId,
        worldType: client.worldType,
    }     
    
    client.connection.send(JSON.stringify(message));
}

export function sendDownKeyUpMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.DOWN_KEY_UP,
        clientId: client.currentClientId,
        worldType: client.worldType,
    }
    
    client.connection.send(JSON.stringify(message));
}

// Attack key:
export function sendAttackMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.ATTACK,
        clientId: client.currentClientId,
        worldType: client.worldType,
    }
    
    client.connection.send(JSON.stringify(message));
}