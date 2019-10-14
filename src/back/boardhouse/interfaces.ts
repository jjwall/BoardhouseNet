import * as WebSocket from "ws";
import { BaseState } from "./basestate";

export interface IBoardhouseBack {
    connection: WebSocket,
    gameServerPort: string,
    connections: number
}

export interface RegistryKeyToSystemMap {
    [key: string]: (ents: ReadonlyArray<Object>, state: BaseState) => void;
}

export interface RegistryKeyToEntityListMap {
    [key: string]: Array<Object>;
}