import { IGlobalLobby } from "./interfaces";
import { isNullOrWhitespace } from "./helpers";

export function createRoom(globalLobby: IGlobalLobby) {
    if (isNullOrWhitespace(globalLobby.roomNameInput.value)) {
        return alert("Room Name field must have a value.");
    }
}
