import * as WebSocket from "ws";

export interface IBoardhouseBack {
    connection: WebSocket,
    gameServerPort: string,
    connections: number
}