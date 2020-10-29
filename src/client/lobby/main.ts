import { IGlobalLobby } from "./interfaces";
import { createRoom } from "./createroom";
import { populateRoomList } from "./populateroomlist";
import { PortToConnectionsMap } from "../../packets/porttoconnectionsmap";

// Global lobby variable.
const globalLobby: IGlobalLobby = {
    createRoomButton: <HTMLButtonElement>document.getElementById("createRoomButton"),
    roomNameInput: <HTMLButtonElement>document.getElementById("roomNameInput"),
    createRoomText: <HTMLElement>document.getElementById("createRoomText"),
    gameRooms: <HTMLElement>document.getElementById("gameRooms"),
    currentLoginUserId: window.navigator.userAgent.replace(/\D+/g, '')
}

globalLobby.createRoomButton.onclick = function() {
    createRoom(globalLobby);
}

function getRoomList():void {
    var url = <string>window.location.href + "getportconnections";

    fetch(url)
    .then(function(response):Promise<any> {
        return response.json();
    })
    .catch(function(error):void {
        console.log("Error: " + error);
    })
    .then(function(portsToConnectionsMap: PortToConnectionsMap):void {
        console.log(portsToConnectionsMap);
        populateRoomList(globalLobby, portsToConnectionsMap);
    });
}

getRoomList();

setInterval(function() {
    getRoomList();
}, 60000);