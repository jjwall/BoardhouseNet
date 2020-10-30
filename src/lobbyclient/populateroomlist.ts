import { IGlobalLobby } from './interfaces';
import { PortToConnectionsMap } from "../packets/porttoconnectionsmap";
import { ClientRoleTypes } from '../packets/clientroletypes';

export function populateRoomList(globalLobby: IGlobalLobby, portsToConnectionsMap: PortToConnectionsMap) {
    globalLobby.gameRooms.innerHTML = `
    <tr>
        <th>Room Name</th>
        <th>Players</th>
        <th>Join</th>
    </tr>`;

    for (let key in portsToConnectionsMap) {
        const currentPort = key;
        const gameRoomName = portsToConnectionsMap[key].name;
        const players = portsToConnectionsMap[key].connections;

        globalLobby.gameRooms.innerHTML += `
            <tr>
                <td>${gameRoomName}: (Port: ${currentPort})</td>
                <td>(${players}/3)</td>
                <td><button class="roomJoin" data-port=${key}>Join</button></<td>
            </tr>`
    }

    const joinButtonElements = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('roomJoin');

    for (var i = 0; i < joinButtonElements.length; i++) {
        joinEvent(joinButtonElements[i], joinButtonElements[i].attributes[1].value, globalLobby);
    };
}


function joinEvent (element:HTMLElement, port:String, globalLobby: IGlobalLobby) {
    element.onclick = function() {
        window.location.href = `/playgame?port=${port}&clientId=${globalLobby.currentClientId}&clientRole=${ClientRoleTypes.PLAYER}`
        console.log(port);
    }
}