import { NetEntityEventTypes } from "./netentityeventtypes";
import { Message } from "./message";

export interface NetEntityMessage extends Message {
    eventType: NetEntityEventTypes;
    data: EntityData[];
}