import { createServer } from 'http';
import { Response, Request } from 'express';
import * as express from 'express';
import * as WebSocket from 'ws';
import * as bodyParser from 'body-parser';
import { findOpenPort } from './findopenport';
import { IPortToPendingRequestsMap } from './interfaces';
import { GameServerInfo } from "../packets/gameserverinfo";
import { PortToConnectionsMap } from "../packets/porttoconnectionsmap";
import { isEmpty } from './helpers';
import { requestConnections } from './requestconnections';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ server });

// Global server variable.
const globalServer = {
    portToConnectionsMap: <PortToConnectionsMap> {},
    portToPendingRequestsMap: <IPortToPendingRequestsMap> {},
    getConnsArray: <Array<() => void>> []
}

wss.on('connection', function(connection) {
    console.log("Lobby: connected to new instance of a game server.");

    	// ping all game servers so we can resolve the requests set up by "/creategameroom" POST
	requestConnections(wss);

	// listens for connection info from game servers
	connection.on('message', function(message: string) {
		const currentGameServerInfo: GameServerInfo = JSON.parse(message);
		const currentPort = currentGameServerInfo["port"];
		const numberOfPlayersConnected = currentGameServerInfo["playersConnected"];
		const numberOfSpectatorsConnected = currentGameServerInfo["spectatorsConnected"];

		// update port connection struct with new connection info
		globalServer.portToConnectionsMap[currentPort]["playersConnected"] = numberOfPlayersConnected;
		globalServer.portToConnectionsMap[currentPort]["spectatorsConnected"] = numberOfSpectatorsConnected;

		for (var key in globalServer.portToPendingRequestsMap) {
			// resolve request
			globalServer.portToPendingRequestsMap[key]();
			// delete value as request is no longer pending
			delete globalServer.portToPendingRequestsMap[key];
		}

		// iterate through getConnsArray and resolve each request
		for (var i = 0; i < globalServer.getConnsArray.length; i++) {
			// resolve request
			globalServer.getConnsArray[i]();
			// delete value at index i as request has been resolved
			globalServer.getConnsArray.splice(i, 1);
        }
    });
});

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(express.static('./public'));

app.get('/', function(req, res) {
    res.sendFile('/public/lobby.html', { root: './'});
});

app.get('/playgame', function(req: Request, res: Response) {
    res.sendFile('/public/game.html', { root: './'});
});

app.get("/getportconnections", function(req, res) {
    // ping all servers so our request can be resolved

    requestConnections(wss);

	if (isEmpty(globalServer.portToConnectionsMap)) {
		res.send(globalServer.portToConnectionsMap);
	}
	else {
		// push response param onto getConnsArray
		globalServer.getConnsArray.push(function(){
			res.send(globalServer.portToConnectionsMap);
		});
	}
});

app.post('/creategameroom', function(req, res: Response) {
    findOpenPort(req.body.name,
                globalServer.portToConnectionsMap, 
                globalServer.portToPendingRequestsMap,
                res);
    
    console.log(globalServer.portToPendingRequestsMap);
    console.log(globalServer.portToConnectionsMap);
});

server.listen(PORT, function () {
    console.log(`app listening on port ${PORT}`);
});