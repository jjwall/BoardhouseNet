import { Message } from "../../packets/message";
import { NetIdToEntityMap, QueriedInput } from "./interfaces";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "./basestate";
import * as WebSocket from "ws";

export interface ServerConfig {
    clientConnection: WebSocket, // lobbyClientConnection
    gameServerPort: string,
    gameTicksPerSecond: number;
    displayHitBoxes: boolean;
}

export class Server {
    constructor(config: ServerConfig) {
        // Set configs.
        this.clientConnection = config.clientConnection;
        this.gameServerPort = config.gameServerPort;
        this.millisecondsPerGameTick = 1000 / config.gameTicksPerSecond;
        this.displayHitBoxes = config.displayHitBoxes;

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
    public displayHitBoxes: boolean;
    // #endregion

    // #region Non-config fields
    public playerClientIds: string[];
    public spectatorClientIds: string[];
    public boardhouseServer: WebSocket.Server; // need to rename into something more apt - websocketServer?
    public currentNetId: number;
    public netIdToEntityMap: NetIdToEntityMap; // -> this is to avoid having to do a search for the NetId all the time when updating / destroying entities
    public messagesToProcess: Array<Message>;
    public currentState: BaseState;
    public entityChangeList: Entity[] = [];
    public queriedInputs: QueriedInput[] = [];
    // #endregion
}