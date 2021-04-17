import { ClientMessage } from "../../packets/clientmessage";
import { NetIdToEntityMap } from "./interfaces";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "./basestate";
import * as WebSocket from "ws";

export interface ServerConfig {
    clientConnection: WebSocket, // lobbyClientConnection
    gameServerPort: string,
    playerClientIds: string[]; // don't need as config
    spectatorClientIds: string[]; // don't need as config
    boardhouseServer: WebSocket.Server, // need to rename into something more apt - websocketServer?
    currentNetId: number,
    netIdToEntityMap: NetIdToEntityMap, // don't need as config -> this is to avoid having to do a search for the NetId all the time when updating / destroying
    messagesToProcess: Array<ClientMessage> // don't need as config
}

export class Server {
    constructor(config: ServerConfig) {
        this.clientConnection = config.clientConnection;
        this.gameServerPort = config.gameServerPort;
        this.playerClientIds = config.playerClientIds;
        this.playerClientIds = config.spectatorClientIds;
        this.boardhouseServer = config.boardhouseServer;
        this.currentNetId = config.currentNetId;
        this.netIdToEntityMap = config.netIdToEntityMap;
        this.messagesToProcess = config.messagesToProcess;
        
    }
    // config fields
    public clientConnection: WebSocket; // lobbyClientConnection
    public gameServerPort: string;
    public playerClientIds: string[];
    public spectatorClientIds: string[];
    public boardhouseServer: WebSocket.Server;
    public currentNetId: number;
    public netIdToEntityMap: NetIdToEntityMap;
    public messagesToProcess: Array<ClientMessage>;
    // end config fields

    public stateStack: BaseState[] = [];
}