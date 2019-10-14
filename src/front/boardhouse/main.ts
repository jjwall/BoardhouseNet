const params = <URLSearchParams> new URLSearchParams(window.location.search);

const boardhouseFront = {
    connection: <WebSocket> null,
    currentPort: <number>parseInt(params.get("port")),
    currentLoginUserId: <number>parseInt(params.get("loginUserId")),
    hostName: <string>window.location.hostname != "" ? window.location.hostname : "localhost",
}

boardhouseFront.connection = new WebSocket("ws://" + 
                                           boardhouseFront.hostName + ":" +
                                           boardhouseFront.currentPort);

// boardhouseFront.connection.onopen = function() {

// }