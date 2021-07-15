import { IGlobalLobby } from "./interfaces";
import { createRoom } from "./createroom";
import { populateRoomList } from "./populateroomlist";
import { PortToConnectionsMap } from "../packets/porttoconnectionsmap";
	
function createRandomClientId(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let clientId = "";

    for (let i = 0; i < 8; i++) {
        clientId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return clientId;
}

// Global lobby variable.
const globalLobby: IGlobalLobby = {
    createRoomButton: <HTMLButtonElement>document.getElementById("createRoomButton"),
    roomNameInput: <HTMLButtonElement>document.getElementById("roomNameInput"),
    createRoomText: <HTMLElement>document.getElementById("createRoomText"),
    gameRooms: <HTMLElement>document.getElementById("gameRooms"),
    classSelectRadioElements: document.getElementsByName("classSelect"),
    worldSelectRadioElements: document.getElementsByName("worldSelect"),
    // currentClientId: window.navigator.userAgent.replace(/\D+/g, '')
    // temporary solution for providing a clientId
    // above solution may work, but not when testing with the same browser
    // also above provide's too big a number to work with so it would need to be trimmed down
    currentClientId: createRandomClientId()
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