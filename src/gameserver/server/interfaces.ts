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

export interface TileSetSchema {
    tileswide: number;
    tileheight: number;
    tileshigh: number;
    layers: Array<TileSetLayerSchema>;
    tilewidth: number;
}

interface TileSetLayerSchema {
    name: string;
    tiles: Array<TileSchema>;
    number: number;
}

interface TileSchema {
    rot: number;
    y: number;
    tile: number;
    flipX: boolean;
    index: number;
    x: number;
}