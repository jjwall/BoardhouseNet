import { NetEntityEventTypes } from "./netentityeventtypes";
import { EntityData } from "./entitydata";
import { Message } from "./message";
import { WorldTypes } from "./networldmessage";

export interface NetEntityMessage extends Message {
    eventType: NetEntityEventTypes;
    worldType: WorldTypes;
    data: EntityData[];
}