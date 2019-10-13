import { IGlobalLobby } from "./interfaces";
import { createRoom } from "./createroom";

// Global lobby variable.
const globalLobby: IGlobalLobby = {
    createRoomButton: <HTMLButtonElement>document.getElementById('createRoomButton'),
    roomNameInput: <HTMLButtonElement>document.getElementById('roomNameInput'),
    createRoomText: <HTMLElement>document.getElementById('createRoomText'),
}

globalLobby.createRoomButton.onclick = function() {
    createRoom(globalLobby);
}