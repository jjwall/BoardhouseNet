import * as WebSocket from "ws";
import { BaseState } from "./basestate";
import { Entity } from "../states/gameplay/entity";
import { PlayerMessage } from "../../packets/playermessage";

export interface IBoardhouseBack {
    clientConnection: WebSocket,
    gameServerPort: string,
    connections: number,
    boardhouseSocket: WebSocket, // prob don't need
    boardhouseServer: WebSocket.Server,
    currentNetId: number,
    netIdToEntityMap: NetIdToEntityMap,
    messagesToProcess: Array<PlayerMessage>
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