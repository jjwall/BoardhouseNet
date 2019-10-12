import { createServer } from 'http';
import * as express from 'express';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;

app.use(express.static('./views'));

app.get('/', function(req, res) {
    res.sendFile('/views/lobby.html', { root: './'});
});

app.get('/game', function(req, res) {
    res.sendFile('/views/game.html', { root: './'});
});

server.listen(PORT, function () {
    console.log(`app listening on port ${PORT}`);
});