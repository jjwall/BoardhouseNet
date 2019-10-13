console.log("engine files go here");
console.log("handle process.argv arguments");
console.log("listen on port: " + process.argv[2]);

import * as net from 'net';

const socket = new net.Socket();
socket.connect(8080, "localhost", function() {
    console.log("Client: connected to lobby");
});

// const connection = new WebSocket('localhost:8080');