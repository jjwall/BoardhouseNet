import { MessageTypes } from "../../packets/messages/message";
import { Client } from "../clientengine/client";
import {
    ClientInputTypes, 
    ClientMessageDownKeyDown, 
    ClientMessageDownKeyUp, 
    ClientMessageLeftKeyDown, 
    ClientMessageLeftKeyUp, 
    ClientMessageRightKeyDown, 
    ClientMessageRightKeyUp, 
    ClientMessageSkillOne, 
    ClientMessageSkillTwo, 
    ClientMessageUpKeyDown, 
    ClientMessageUpKeyUp } 
from "../../packets/messages/clientinputmessage";

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

// Skill inputs:
export function sendSkillOneMessage(client: Client) {
    const message: ClientMessageSkillOne  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.SKILL_ONE,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }   
    
    client.connection.send(JSON.stringify(message));
}

export function sendSkillTwoMessage(client: Client) {
    const message: ClientMessageSkillTwo  = {
        messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
        inputType: ClientInputTypes.SKILL_TWO,
        data: {
            clientId: client.currentClientId,
            worldType: client.worldType,
        }
    }   
    
    client.connection.send(JSON.stringify(message));
}