import { NetEntityEventTypes } from "./netentityeventtypes";
import { EntityData } from "./entitydata";
import { Message } from "./message";

export interface NetEntityMessage extends Message {
    eventType: NetEntityEventTypes;
    data: EntityData[];
}