import { IPortToPendingRequestsMap } from "./interfaces";
import { Response, Request } from 'express';
import { spinUpGameServer } from './spinupgameserver';
import { PortToConnectionsMap } from "../packets/misc/porttoconnectionsmap";

/**
 * Finds an open port to create a new game room on and then spins up new game server on that port.
 * @param gameRoomName Name passed in from the client
 * @param portToConnectionsMap Mapping table that holds game room name and number of connections based on the port.
 * @param portToPendingRequestsMap Mapping table that registers pending requests based on port number.
 * @param response 
 */
export function findOpenPort(gameRoomName: string, portToConnectionsMap: PortToConnectionsMap, portToPendingRequestsMap: IPortToPendingRequestsMap, response: any) {
	let openPort = "9001";
	let iterator = 0;

	for (let key in portToConnectionsMap) {
		const potentialAvailablePort: number = Number(openPort) + iterator;
		
		if (portToConnectionsMap[potentialAvailablePort] === undefined) {
			openPort = potentialAvailablePort.toString();
			break;
		}
		else if (portToConnectionsMap[potentialAvailablePort + 1] === undefined) {
			openPort = (potentialAvailablePort + 1).toString();
			break;
		}
		iterator++;
	}

	portToConnectionsMap[openPort] = {"name": gameRoomName, "playersConnected": 0, "spectatorsConnected": 0};

	portToPendingRequestsMap[openPort] = function() {
		response.send(portToConnectionsMap);
	}

	spinUpGameServer(openPort);
}