import { IGlobalLobby } from "./interfaces";
import { PortToConnectionsMap } from "../../packets/porttoconnectionsmap";
import { isNullOrWhitespace } from "./helpers";
import { populateRoomList } from "./populateroomlist";

export function createRoom(globalLobby: IGlobalLobby) {
    if (isNullOrWhitespace(globalLobby.roomNameInput.value)) {
        return alert("Room Name field must have a value.");
    }

    globalLobby.createRoomButton.disabled = true;
    globalLobby.roomNameInput.disabled = true;
    globalLobby.createRoomText.innerHTML = "Creating Room...";

    const url = <string>window.location.href + "creategameroom";
    const data = <object>{name: globalLobby.roomNameInput.value};

    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    })
    .then(function(response):Promise<any> {
        console.log("creating game room...");
        return response.json();
    })
    .catch(function(error):void {
        console.log("Error: " + error);
    })
    .then(function(portsToConnectionsMap: PortToConnectionsMap):void {
        globalLobby.createRoomButton.disabled = false;
        globalLobby.roomNameInput.disabled = false;
        globalLobby.createRoomText.innerHTML = "Room created successfully!";
        globalLobby.roomNameInput.value = "";
        populateRoomList(globalLobby, portsToConnectionsMap);
    });
}
