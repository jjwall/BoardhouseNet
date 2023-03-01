export interface IGlobalLobby {
    createRoomButton: HTMLButtonElement,
    roomNameInput: HTMLButtonElement,
    usernameInput: HTMLButtonElement,
    createRoomText: HTMLElement,
    classSelectRadioElements: NodeListOf<HTMLElement>,
    worldSelectRadioElements: NodeListOf<HTMLElement>,
    gameRooms: HTMLElement,
    currentClientId: string,
}