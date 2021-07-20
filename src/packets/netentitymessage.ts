import { NetEntityEventTypes } from "./netentityeventtypes";
import { EntityData } from "./entitydata";
import { Message } from "./message";
import { WorldTypes } from "./worldtypes";

export interface NetEntityMessage extends Message {
    eventType: NetEntityEventTypes;
    worldType: WorldTypes;
    data: EntityData[];
}