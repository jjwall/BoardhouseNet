import { IGlobalLobby } from "./interfaces";
import { isNullOrWhitespace } from "./helpers";

export function createRoom(globalLobby: IGlobalLobby) {
    if (isNullOrWhitespace(globalLobby.roomNameInput.value)) {
        return alert("Room Name field must have a value.");
    }

    globalLobby.createRoomButton.disabled = true;
    globalLobby.roomNameInput.disabled = true;
    globalLobby.createRoomText.innerHTML = 'Creating Room...';

    const url = <string>window.location.href + 'creategameroom';
    const data = <object>{name: globalLobby.roomNameInput.value};

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
}
