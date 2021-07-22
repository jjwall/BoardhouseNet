// probably should rename this "PortToGameServerMap"
export interface PortToConnectionsMap {
    [port: string]: {
        name: string,
        playersConnected: number,
        spectatorsConnected: number,
    }
}