import { MessageTypes } from "../../packets/message";
import { Client } from "../clientengine/client";
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
from "../../packets/clientinputmessage";

// Left movement key:
export function sendLeftKeyDownMessage(client: Client) {
    const message: ClientMessageLeftKeyDown  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.LEFT_KEY_DOWN,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }

    client.connection.send(JSON.stringify(message));
}

export function sendLeftKeyUpMessage(client: Client) {
    const message: ClientMessageLeftKeyUp  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.LEFT_KEY_UP,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }
    
    client.connection.send(JSON.stringify(message));
}

// Right movement key:
export function sendRightKeyDownMessage(client: Client) {
    const message: ClientMessageRightKeyDown  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.RIGHT_KEY_DOWN,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }   
    
    client.connection.send(JSON.stringify(message));
}

export function sendRightKeyUpMessage(client: Client) {
    const message: ClientMessageRightKeyUp  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.RIGHT_KEY_UP,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }
    
    client.connection.send(JSON.stringify(message));
}

// Up movement key:
export function sendUpKeyDownMessage(client: Client) {
    const message: ClientMessageUpKeyDown  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.UP_KEY_DOWN,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }   
    
    client.connection.send(JSON.stringify(message));
}

export function sendUpKeyUpMessage(client: Client) {
    const message: ClientMessageUpKeyUp  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.UP_KEY_UP,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }   
    
    client.connection.send(JSON.stringify(message));
}

// Down movement key:
export function sendDownKeyDownMessage(client: Client) {
    const message: ClientMessageDownKeyDown  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.DOWN_KEY_DOWN,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }      
    
    client.connection.send(JSON.stringify(message));
}

export function sendDownKeyUpMessage(client: Client) {
    const message: ClientMessageDownKeyUp  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.DOWN_KEY_UP,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }   
    
    client.connection.send(JSON.stringify(message));
}

// Attack key:
export function sendAttackMessage(client: Client) {
    const message: ClientMessageAttack  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.ATTACK,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }   
    
    client.connection.send(JSON.stringify(message));
}