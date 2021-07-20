import { IGlobalLobby } from './interfaces';
import { PortToConnectionsMap } from "../packets/porttoconnectionsmap";
import { ClientRoleTypes } from '../packets/clientroletypes';
import { PlayerClassTypes } from '../packets/playerclasstypes';
import { WorldTypes } from '../packets/worldtypes';

export function populateRoomList(globalLobby: IGlobalLobby, portsToConnectionsMap: PortToConnectionsMap) {
    globalLobby.gameRooms.innerHTML = `
    <tr>
        <th>Room Name</th>
        <th>Players</th>
        <th>Spectators</th>
        <th>Join</th>
        <th>Spectate</th>
    </tr>`;

    for (let key in portsToConnectionsMap) {
        const currentPort = key;
        const gameRoomName = portsToConnectionsMap[key].name;
        const players = portsToConnectionsMap[key].playersConnected;
        const spectators = portsToConnectionsMap[key].spectatorsConnected;

        globalLobby.gameRooms.innerHTML += `
            <tr>
                <td>${gameRoomName}: (Port: ${currentPort})</td>
                <td>(${players}/3)</td>
                <td>${spectators}</td>
                <td><button class="roomJoin" data-port=${key}>Join</button></<td>
                <td><button class="spectate" data-port=${key}>Spectate</button></<td>
            </tr>`
    }

    const joinButtonElements = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('roomJoin');
    const spectateButtonElements = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('spectate');

    for (let i = 0; i < joinButtonElements.length; i++) {
        joinEvent(joinButtonElements[i], joinButtonElements[i].attributes[1].value, globalLobby);
    };

    for (let i = 0; i < spectateButtonElements.length; i++) {
        spectateEvent(spectateButtonElements[i], spectateButtonElements[i].attributes[1].value, globalLobby);
    };
}


function joinEvent (element:HTMLElement, port:String, globalLobby: IGlobalLobby) {
    element.onclick = function() {
        const playerClassSelection = classSelectRadioValue(globalLobby);
        const worldSelection = worldSelectRadioValue(globalLobby);
        window.location.href = `/playgame?port=${port}&clientId=${globalLobby.currentClientId}&clientRole=${ClientRoleTypes.PLAYER}&playerClass=${playerClassSelection}&worldType=${worldSelection}`
        console.log(port);
    }
}

function spectateEvent (element:HTMLElement, port:String, globalLobby: IGlobalLobby) {
    element.onclick = function() {
        window.location.href = `/playgame?port=${port}&clientId=${globalLobby.currentClientId}&clientRole=${ClientRoleTypes.SPECTATOR}&playerClass=${PlayerClassTypes.NULL}`
        console.log(port);
    }
}

function classSelectRadioValue (globalLobby: IGlobalLobby) : PlayerClassTypes {
    let playerClassSelection = PlayerClassTypes.NULL;
    for (var i = 0, length = globalLobby.classSelectRadioElements.length; i < length; i++) {
        if ((globalLobby.classSelectRadioElements[i] as HTMLInputElement).checked) {
            switch ((globalLobby.classSelectRadioElements[i] as HTMLInputElement).value) {
                case "page":
                    playerClassSelection = PlayerClassTypes.PAGE;
                    break;
                case "archer":
                    playerClassSelection = PlayerClassTypes.ARCHER;
                    break;
                case "magician":
                    playerClassSelection = PlayerClassTypes.MAGICIAN;
                    break;
            }
          break;
        }
    }

    return playerClassSelection;
}

function worldSelectRadioValue (globalLobby: IGlobalLobby) : WorldTypes {
    let worldSelection = WorldTypes.CASTLE;
    for (var i = 0, length = globalLobby.worldSelectRadioElements.length; i < length; i++) {
        if ((globalLobby.worldSelectRadioElements[i] as HTMLInputElement).checked) {
            switch ((globalLobby.worldSelectRadioElements[i] as HTMLInputElement).value) {
                case "castle":
                    worldSelection = WorldTypes.CASTLE;
                    break;
                case "item_shop":
                    worldSelection = WorldTypes.ITEM_SHOP;
                    break;
            }
          break;
        }
    }

    return worldSelection;
}