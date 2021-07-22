import { BaseWorldEngine } from "./baseworldengine";
import { Entity } from "./entity";
import { ClientInputTypes } from "../../packets/clientinputtypes";
import { WorldTypes } from "../../packets/worldtypes";

export interface NetIdToEntityMap {
    [netId: number]: Entity;
}

export interface RegistryKeyToSystemMap {
    [key: string]: (ents: ReadonlyArray<Object>, worldEngine: BaseWorldEngine) => void;
}

export interface RegistryKeyToEntityListMap {
    [key: string]: Array<Object>;
}

export interface QueriedInput {
    inputType: ClientInputTypes,
    worldType: WorldTypes,
    clientId: string,
}