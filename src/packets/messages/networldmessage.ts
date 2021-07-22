import { WorldTransitionData } from "../data/worldtransitiondata";
import { WorldLevelData } from "../data/worldleveldata";
import { Message } from "./message";

export type NetWorldMessage = 
    NetMessageLoadWorld | 
    NetMessageUnloadWorld | 
    NetMessagePlayerWorldTransition
;

export interface NetMessageLoadWorld extends Message {
    eventType: NetWorldEventTypes.LOAD_WORLD;
    data: WorldLevelData;
}

export interface NetMessageUnloadWorld extends Message {
    eventType: NetWorldEventTypes.UNLOAD_WORLD;
}

export interface NetMessagePlayerWorldTransition extends Message {
    eventType: NetWorldEventTypes.PLAYER_WORLD_TRANSITION;
    data: WorldTransitionData;
}

export enum NetWorldEventTypes {
    LOAD_WORLD = "LOAD_WORLD",
    UNLOAD_WORLD = "UNLOAD_WORLD",
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION"
}