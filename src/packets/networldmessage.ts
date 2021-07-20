import { WorldTransitionData } from "./worldtransitiondata";
import { WorldLevelData } from "./worldleveldata";
import { Message } from "./message";

export type NetWorldMessage = 
    MessageLoadWorld | 
    MessageUnloadWorld | 
    MessagePlayerWorldTransition
;

export interface MessageLoadWorld extends Message {
    eventType: NetWorldEventTypes.LOAD_WORLD;
    data: WorldLevelData;
}

export interface MessageUnloadWorld extends Message {
    eventType: NetWorldEventTypes.UNLOAD_WORLD;
}

export interface MessagePlayerWorldTransition extends Message {
    eventType: NetWorldEventTypes.PLAYER_WORLD_TRANSITION;
    data: WorldTransitionData;
}

export enum NetWorldEventTypes {
    LOAD_WORLD = "LOAD_WORLD",
    UNLOAD_WORLD = "UNLOAD_WORLD",
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION"
}