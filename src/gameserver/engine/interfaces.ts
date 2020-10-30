import * as WebSocket from "ws";
import { BaseState } from "./basestate";
import { Entity } from "../states/gameplay/entity";
import { ClientMessage } from "../../packets/clientmessage";

export interface IBoardhouseBack {
    clientConnection: WebSocket,
    gameServerPort: string,
    connections: number,
    boardhouseSocket: WebSocket, // prob don't need
    boardhouseServer: WebSocket.Server,
    currentNetId: number,
    netIdToEntityMap: NetIdToEntityMap,
    messagesToProcess: Array<ClientMessage>
}

export interface NetIdToEntityMap {
    [netId: number]: Entity;
}

export interface RegistryKeyToSystemMap {
    [key: string]: (ents: ReadonlyArray<Object>, state: BaseState) => void;
}

export interface RegistryKeyToEntityListMap {
    [key: string]: Array<Object>;
}