import * as WebSocket from "ws";
import { BaseState } from "./basestate";
import { Entity } from "./entity";
import { ClientEventMessage } from "../../packets/clienteventmessage";
import { ClientInputTypes } from "../../packets/clientinputtypes";
import { WorldTypes } from "../../packets/networldmessage";

export interface NetIdToEntityMap {
    [netId: number]: Entity;
}

export interface RegistryKeyToSystemMap {
    [key: string]: (ents: ReadonlyArray<Object>, state: BaseState) => void;
}

export interface RegistryKeyToEntityListMap {
    [key: string]: Array<Object>;
}

export interface QueriedInput {
    inputType: ClientInputTypes,
    worldType: WorldTypes,
    clientId: string,
}