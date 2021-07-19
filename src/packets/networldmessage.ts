import { NetWorldEventTypes } from "./networldeventtypes";
import { WorldLevelData } from "./worldleveldata";
import { Message } from "./message";
import { WorldTransitionData } from "./worldtransitiondata";

export interface NetWorldMessage extends Message {
    eventType: NetWorldEventTypes;
    data: WorldLevelData | WorldTransitionData;
}