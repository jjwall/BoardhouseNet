import { processClientMessages, processQueriedInputs } from "../messaging/processclientmessages";
import { NetIdToEntityMap, QueriedInput } from "./interfaces";
import { Entity } from "../states/gameplay/entity";
import { Message } from "../../packets/message";
import { BaseState } from "./basestate";
import * as WebSocket from "ws";

export interface ServerConfig {
    clientConnection: WebSocket, // lobbyClientConnection
    gameServerPort: string,
    gameTicksPerSecond: number;
}

export class Server {
    constructor(config: ServerConfig) {
        // Set configs.
        this.clientConnection = config.clientConnection;
        this.gameServerPort = config.gameServerPort;
        this.millisecondsPerGameTick = 1000 / config.gameTicksPerSecond;

        // Initialize non-config fields.
        this.playerClientIds = [];
        this.spectatorClientIds = [];
        this.currentNetId = 0;
        this.netIdToEntityMap = {};
        this.messagesToProcess = [];
    }

    // #region Config fields
    public clientConnection: WebSocket; // lobbyClientConnection
    public gameServerPort: string;
    public millisecondsPerGameTick: number;
    // #endregion

    // #region Non-config fields
    public playerClientIds: string[];
    public spectatorClientIds: string[];
    public boardhouseServer: WebSocket.Server; // need to rename into something more apt - websocketServer?
    public currentNetId: number;
    public netIdToEntityMap: NetIdToEntityMap; // -> this is to avoid having to do a search for the NetId all the time when updating / destroying entities
    public messagesToProcess: Array<Message>;
    public worldEngines: BaseState[] = [];
    public entityChangeList: Entity[] = [];
    public queriedInputs: QueriedInput[] = [];
    // #endregion

    public update() : void {
        processClientMessages(this);
        processQueriedInputs(this);
    }
}