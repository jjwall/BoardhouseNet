export interface IPortToConnectionsMap {
    [port: string]: {
        name: string,
        connections: number
    }
}

export interface IPortToPendingRequestsMap {
    [port: string]: () => void;
}

export interface IGameServerInfo {
    port: string;
    connections: number;
}