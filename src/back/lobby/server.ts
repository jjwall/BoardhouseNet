import { createServer } from 'http';
import * as express from 'express';
import * as WebSocket from 'ws';
import * as bodyParser from 'body-parser';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ server });

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(express.static('./views'));

app.get('/', function(req, res) {
    res.sendFile('/views/lobby.html', { root: './'});
});

app.get('/game', function(req, res) {
    res.sendFile('/views/game.html', { root: './'});
});

app.post('/creategameroom', function(req, res) {
    console.log(req.body.name);
});

server.listen(PORT, function () {
    console.log(`app listening on port ${PORT}`);
});