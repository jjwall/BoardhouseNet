import { InputData } from "../data/inputdata";
import { Message } from "./message";

export type ClientInputMessage = 
    ClientMessageLeftKeyDown |
    ClientMessageLeftKeyUp |
    ClientMessageRightKeyDown |
    ClientMessageRightKeyUp |
    ClientMessageUpKeyDown |
    ClientMessageUpKeyUp |
    ClientMessageDownKeyDown |
    ClientMessageDownKeyUp |
    ClientMessageAttack
;

// Left movement key:
export interface ClientMessageLeftKeyDown extends Message {
    inputType: ClientInputTypes.LEFT_KEY_DOWN;
    data: InputData;
}

export interface ClientMessageLeftKeyUp extends Message {
    inputType: ClientInputTypes.LEFT_KEY_UP;
    data: InputData;
}

// Right movement key:
export interface ClientMessageRightKeyDown extends Message {
    inputType: ClientInputTypes.RIGHT_KEY_DOWN;
    data: InputData;
}

export interface ClientMessageRightKeyUp extends Message {
    inputType: ClientInputTypes.RIGHT_KEY_UP;
    data: InputData;
}

// Up movement key:
export interface ClientMessageUpKeyDown extends Message {
    inputType: ClientInputTypes.UP_KEY_DOWN;
    data: InputData;
}

export interface ClientMessageUpKeyUp extends Message {
    inputType: ClientInputTypes.UP_KEY_UP;
    data: InputData;
}

// Down movement key:
export interface ClientMessageDownKeyDown extends Message {
    inputType: ClientInputTypes.DOWN_KEY_DOWN;
    data: InputData;
}

export interface ClientMessageDownKeyUp extends Message {
    inputType: ClientInputTypes.DOWN_KEY_UP;
    data: InputData;
}

// Attack key:
export interface ClientMessageAttack extends Message {
    inputType: ClientInputTypes.ATTACK;
    data: InputData;
}

// Client Input Types:
export enum ClientInputTypes {
    ATTACK = "ATTACK",
    LEFT_KEY_DOWN = "LEFT_KEY_DOWN",
    LEFT_KEY_UP = "LEFT_KEY_UP",
    RIGHT_KEY_DOWN = "RIGHT_KEY_DOWN",
    RIGHT_KEY_UP = "RIGHT_KEY_UP",
    UP_KEY_UP = "UP_KEY_UP",
    UP_KEY_DOWN = "UP_KEY_DOWN",
    DOWN_KEY_UP = "DOWN_KEY_UP",
    DOWN_KEY_DOWN = "DOWN_KEY_DOWN",
}