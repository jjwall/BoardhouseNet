import { Server } from 'ws';

export function requestConnections(wss: Server) {
	wss.clients.forEach(client => {
		client.send("get connections");
	});
}