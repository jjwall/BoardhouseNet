export interface IGlobalLobby {
    createRoomButton: HTMLButtonElement,
    roomNameInput: HTMLButtonElement,
    createRoomText: HTMLElement,
    gameRooms: HTMLElement,
    currentLoginUserId: number,
}

export interface IGameServerInfo {
    port: string;
    connections: number;
}

export interface IPortToConnectionsMap {
    [port: string]: {
        name: string,
        connections: number
    }
}