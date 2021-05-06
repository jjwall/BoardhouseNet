import * as WebSocket from "ws";
import { BaseState } from "./basestate";
import { Entity } from "../states/gameplay/entity";
import { ClientEventMessage } from "../../packets/clienteventmessage";
import { ClientInputTypes } from "../../packets/clientinputtypes";

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
    clientId: string,
}