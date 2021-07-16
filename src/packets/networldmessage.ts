import { NetWorldEventTypes } from "./networldeventtypes";
import { WorldLevelData } from "./worldleveldata";
import { Message } from "./message";

export interface NetWorldMessage extends Message {
    eventType: NetWorldEventTypes;
    data: WorldLevelData;
}