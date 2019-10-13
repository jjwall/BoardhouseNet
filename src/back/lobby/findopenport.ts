import { IPortToConnectionsMap, IPortToPendingRequestsMap } from "./interfaces";
import { Response, Request } from 'express';

/**
 * Finds an open port to create a new game room on and then spins up new game server on that port.
 * @param gameRoomName Name passed in from the client
 * @param portToConnectionsMap Mapping table that holds game room name and number of connections based on the port.
 * @param portToPendingRequestsMap Mapping table that registers pending requests based on port number.
 * @param response 
 */
export function findOpenPort(gameRoomName: string, portToConnectionsMap: IPortToConnectionsMap, portToPendingRequestsMap: IPortToPendingRequestsMap, response: Response) {
	let openPort = 9001;
	let iterator = 0;

	for (let key in portToConnectionsMap) {
		const potentialAvailablePort = openPort + iterator;
		
		if (portToConnectionsMap[potentialAvailablePort] === undefined) {
			openPort = potentialAvailablePort;
			break;
		}
		else if (portToConnectionsMap[potentialAvailablePort + 1] === undefined) {
			openPort = potentialAvailablePort + 1;
			break;
		}
		iterator++;
	}

	portToConnectionsMap[openPort] = {"name": gameRoomName, "connections": 0};

	portToPendingRequestsMap[openPort] = function() {
		response.send(portToConnectionsMap);
	}

	// spinUpWebSocketServer(openPort);
}