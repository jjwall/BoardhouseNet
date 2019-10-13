import { createServer } from 'http';
import { Response, Request } from 'express';
import * as express from 'express';
import * as WebSocket from 'ws';
import * as bodyParser from 'body-parser';
import { findOpenPort } from './findopenport';
import { IPortToConnectionsMap, IPortToPendingRequestsMap } from './interfaces';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ server });

// Global server variable.
const globalServer = {
    portToConnectionsMap: <IPortToConnectionsMap> {},
    portToPendingRequestsMap: <IPortToPendingRequestsMap> {}
}

wss.on('connection', function(connection) {
    console.log("Lobby server is connected to new instance of a game server.");
});

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(express.static('./views'));

app.get('/', function(req, res) {
    res.sendFile('/views/lobby.html', { root: './'});
});

app.get('/game', function(req: Request, res: Response) {
    res.sendFile('/views/game.html', { root: './'});
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