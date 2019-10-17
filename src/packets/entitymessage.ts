import { EntityEventTypes } from "./entityeventtypes";

export interface EntityMessage {
    eventType: EntityEventTypes;
    data: EntityData;
}