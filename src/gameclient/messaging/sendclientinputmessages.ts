import { ClientInputMessage } from "../../packets/clientinputmessage";
import { ClientInputTypes } from "../../packets/clientinputtypes";
import { MessageTypes } from "../../packets/messagetypes";
import { Client } from "../client/client";

// Left movement key:
export function sendLeftKeyDownMessage(client: Client) {
    const message: ClientInputMessage  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.LEFT_KEY_DOWN,
        clientId: client.currentClientId
    }

    client.connection.send(JSON.stringify(message));
}

export function sendLeftKeyUpMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.LEFT_KEY_UP,
        clientId: client.currentClientId
    }
    
    client.connection.send(JSON.stringify(message));
}

// Right movement key:
export function sendRightKeyDownMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.RIGHT_KEY_DOWN,
        clientId: client.currentClientId
    }     
    
    client.connection.send(JSON.stringify(message));
}

export function sendRightKeyUpMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.RIGHT_KEY_UP,
        clientId: client.currentClientId
    }
    
    client.connection.send(JSON.stringify(message));
}

// Attack key:
export function sendAttackMessage(client: Client) {
    const message: ClientInputMessage = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.ATTACK,
        clientId: client.currentClientId
    }
    
    client.connection.send(JSON.stringify(message));
}