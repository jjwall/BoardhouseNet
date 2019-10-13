import { IGlobalLobby } from "./interfaces";
import { createRoom } from "./createroom";

console.log("hello world!");

// Global home variable.
const globalLobby: IGlobalLobby = {
    createRoomButton: <HTMLButtonElement>document.getElementById('createRoomButton'),
    roomNameInput: <HTMLButtonElement>document.getElementById('roomNameInput'),
}

globalLobby.createRoomButton.onclick = function() {
    createRoom(globalLobby);
}