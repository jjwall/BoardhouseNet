export interface PortToConnectionsMap {
    [port: string]: {
        name: string,
        connections: number
    }
}