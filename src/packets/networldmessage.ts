import { NetWorldEventTypes } from "./networldeventtypes";
import { WorldLevelData } from "./worldleveldata";
import { Message } from "./message";
import { WorldTransitionData } from "./worldtransitiondata";

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

export type NetWorldMessage = 
    MessageLoadWorld | 
    MessageUnloadWorld | 
    MessagePlayerWorldTransition
;