import { NetEventTypes } from "./neteventtypes";
import { EntityData } from "./entitydata";
import { Message } from "./message";

export interface NetEventMessage extends Message {
    eventType: NetEventTypes;
    data: EntityData[] // will use Entity Data to display anims (for now)
}