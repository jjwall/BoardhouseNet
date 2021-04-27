import { EntityEventTypes } from "./entityeventtypes";

export interface EntityMessage {
    eventType: EntityEventTypes;
    data: EntityData[];
}

// var x: EntityMessage = {

// }
// export interface NetMessage {
//     eventType: NetEvent;
//     eventData: EventData;
//     entityData: ...
// }

// export interface GenericNetMessage {
//     messageType: string;//NetMessageTypes
// }