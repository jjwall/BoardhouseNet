console.log("engine files go here");
console.log("handle process.argv arguments");
console.log("listen on port: " + process.argv[2]);
import * as WebSocket from 'ws';

const connection = new WebSocket('ws://localhost:8080/');

connection.onopen = function() {
    console.log("opened connection");
}