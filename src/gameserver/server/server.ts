import { ClientMessage } from "../../packets/clientmessage";
import { NetIdToEntityMap } from "./interfaces";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "./basestate";
import * as WebSocket from "ws";

export interface ServerConfig {
    clientConnection: WebSocket, // lobbyClientConnection
    gameServerPort: string,
}

export class Server {
    constructor(config: ServerConfig) {
        // Set configs.
        this.clientConnection = config.clientConnection;
        this.gameServerPort = config.gameServerPort;

        // Initialize non-config fields.
        this.playerClientIds = [];
        this.spectatorClientIds = [];
        this.currentNetId = 0;
        this.netIdToEntityMap = {};
        this.messagesToProcess = [];
        this.stateStack = [];
    }

    // #region Config fields
    public clientConnection: WebSocket; // lobbyClientConnection
    public gameServerPort: string;
    // #endregion

    // #region Non-config fields
    public playerClientIds: string[];
    public spectatorClientIds: string[];
    public boardhouseServer: WebSocket.Server; // need to rename into something more apt - websocketServer?
    public currentNetId: number;
    public netIdToEntityMap: NetIdToEntityMap; // -> this is to avoid having to do a search for the NetId all the time when updating / destroying entities
    public messagesToProcess: Array<ClientMessage>;
    public stateStack: BaseState[];
    // #endregion
}