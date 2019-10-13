import { IGlobalLobby } from "./interfaces";
import { createRoom } from "./createroom";

// Global lobby variable.
const globalLobby: IGlobalLobby = {
    createRoomButton: <HTMLButtonElement>document.getElementById('createRoomButton'),
    roomNameInput: <HTMLButtonElement>document.getElementById('roomNameInput'),
    createRoomText: <HTMLElement>document.getElementById('createRoomText'),
    gameRooms: <HTMLElement>document.getElementById('gameRooms'),
    currentLoginUserId: 100000, // test id
}

globalLobby.createRoomButton.onclick = function() {
    createRoom(globalLobby);
}