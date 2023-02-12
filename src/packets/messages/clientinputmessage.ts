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
    ClientMessageSkillOnePress |
    ClientMessageSkillOneRelease |
    ClientMessageSkillTwoPress |
    ClientMessageSkillTwoRelease |
    ClientMessageDodgeKeyPress
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

// Skill inputs (queried inputs):
export interface ClientMessageSkillOnePress extends Message {
    inputType: ClientInputTypes.SKILL_ONE_PRESS;
    data: InputData;
}

export interface ClientMessageSkillOneRelease extends Message {
    inputType: ClientInputTypes.SKILL_ONE_RELEASE;
    data: InputData;
}

export interface ClientMessageSkillTwoPress extends Message {
    inputType: ClientInputTypes.SKILL_TWO_PRESS;
    data: InputData;
}

export interface ClientMessageSkillTwoRelease extends Message {
    inputType: ClientInputTypes.SKILL_TWO_RELEASE;
    data: InputData;
}

export interface ClientMessageDodgeKeyPress extends Message {
    inputType: ClientInputTypes.DODGE_KEY_PRESS;
    data: InputData;
}

// Client Input Types:
export enum ClientInputTypes {
    // Queried inputs:
    SKILL_ONE_PRESS = "SKILL_ONE_PRESS",
    SKILL_TWO_PRESS = "SKILL_TWO_PRESS",
    SKILL_ONE_RELEASE = "SKILL_ONE_RELEASE",
    SKILL_TWO_RELEASE = "SKILL_TWO_RELEASE",
    DODGE_KEY_PRESS = "DODGE_KEY_PRESS", // Does this need to be an immediate input?
    // Immediate inputs:
    LEFT_KEY_DOWN = "LEFT_KEY_DOWN",
    LEFT_KEY_UP = "LEFT_KEY_UP",
    RIGHT_KEY_DOWN = "RIGHT_KEY_DOWN",
    RIGHT_KEY_UP = "RIGHT_KEY_UP",
    UP_KEY_UP = "UP_KEY_UP",
    UP_KEY_DOWN = "UP_KEY_DOWN",
    DOWN_KEY_UP = "DOWN_KEY_UP",
    DOWN_KEY_DOWN = "DOWN_KEY_DOWN",
}