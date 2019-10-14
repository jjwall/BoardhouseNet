import * as WebSocket from "ws";
import { BaseState } from "./basestate";

export interface IBoardhouseBack {
    clientConnection: WebSocket,
    gameServerPort: string,
    connections: number,
    gameServerSocket: WebSocket,
}

export interface RegistryKeyToSystemMap {
    [key: string]: (ents: ReadonlyArray<Object>, state: BaseState) => void;
}

export interface RegistryKeyToEntityListMap {
    [key: string]: Array<Object>;
}