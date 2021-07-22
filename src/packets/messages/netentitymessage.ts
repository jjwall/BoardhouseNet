import { EntityData } from "../data/entitydata";
import { Message } from "./message";
import { WorldTypes } from "../enums/worldtypes";

export type NetEntityMessage = 
    NetMessageCreateEntities |
    NetMessageUpdateEntities |
    NetMessageDestroyEntities
;

export interface NetMessageCreateEntities extends Message {
    eventType: NetEntityEventTypes.CREATE;
    data: {
        worldType: WorldTypes;
        ents: EntityData[];
    }
}

export interface NetMessageUpdateEntities extends Message {
    eventType: NetEntityEventTypes.UPDATE;
    data: {
        worldType: WorldTypes;
        ents: EntityData[];
    }
}

export interface NetMessageDestroyEntities extends Message {
    eventType: NetEntityEventTypes.DESTROY;
    data: {
        worldType: WorldTypes;
        ents: EntityData[];
    }
}

export enum NetEntityEventTypes {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DESTROY = "DESTROY"
}