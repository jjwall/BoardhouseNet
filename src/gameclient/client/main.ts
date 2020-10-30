import { setEventListeners } from "./seteventlisteners";
import { OrthographicCamera, WebGLRenderer, Scene, Color } from "three";
import { messageHandlerSystem } from "../messaging/messagehandlersystem";
import { PlayerMessage } from "../../packets/playermessage";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { Client, ClientConfig } from "./client";
import { GameServerStateTypes } from "../../packets/gameserverstatetypes";
import { ClientRoleTypes } from "../../packets/clientroletypes";

const params = <URLSearchParams> new URLSearchParams(window.location.search);
const clientRole = ClientRoleTypes.PLAYER; // if params.get("loginUserId") is a playerId: player, else spectator

const config: ClientConfig = {
    clientRole: clientRole, // would not be determined here. But role would change how event handling works. Only need player sending key press events for example. Maybe if playerId then player else specator.
    connection: <WebSocket> null,
    currentPort: <number>parseInt(params.get("port")),
    currentPlayerId: <number>parseInt(params.get("loginUserId")),
    hostName: <string>window.location.hostname != "" ? window.location.hostname : "localhost",
    keyLeftIsDown: false,
    keyRightIsDown: false,
    // netIdToEntMap: Array<NetIdToEntMap> // TODO: Implement!! (FrontEnt vs BackEnt, EntData is separate)
    /// ----
    screenWidth: 1280,
    screenHeight: 720,
    // gameTicksPerSecond: 60,
    // displayFPS: true,
    // displayHitBoxes: true,
    // globalErrorHandling: true,
    fontUrls: [
        "./data/fonts/helvetiker_regular_typeface.json"
    ],
    textureUrls: [
        "./data/textures/cottage.png",
        "./data/textures/msknight.png",
        "./data/textures/snow.png",
    ],
    audioUrls: [
        "./data/audio/Pale_Blue.mp3",
    ],
}

const client = new Client(config);

client.connection = new WebSocket("ws://" + 
                                           client.hostName + ":" +
                                           client.currentPort);

client.connection.onopen = function() {
    let message: PlayerMessage;

    switch (client.clientRole) {
        case ClientRoleTypes.PLAYER:
            message = {
                eventType: ClientEventTypes.PLAYER_JOINED,
                playerId: client.currentPlayerId
            }
            
            console.log("client joining as player");
    
            client.connection.send(JSON.stringify(message));
            break;
        case ClientRoleTypes.SPECTATOR:
            message = {
                eventType: ClientEventTypes.SPECTATOR_JOINED,
                playerId: client.currentPlayerId
            }
            
            console.log("client joining as spectator");
    
            client.connection.send(JSON.stringify(message));
            break;
    }
}

client.loadAssets().then(() => {
    client.initializeState(GameServerStateTypes.GAMEPLAY);
    main(<HTMLElement>document.getElementById("canvasContainer"));
});

/**
 * 
 * @param canvasContainer Captured Canvas Container Element
 * 
 * Main function that gets immediately invoked.
 * Only dependecy is the canvas container element. Also triggers the event pump.
 */
function main(canvasContainer: HTMLElement) {
    // set up renderer
    const renderer = new WebGLRenderer();
    renderer.setSize(client.screenWidth, client.screenHeight);
    renderer.autoClear = false;
    client.renderer = renderer;

    // append canvas element to canvas container
    canvasContainer.append(renderer.domElement);

    // disable right click context menu
    renderer.domElement.oncontextmenu = function (e) {
        e.preventDefault();
    };

    let fps: number = 0;
    let totalTime: number = 0;
    let currentTime: number = 0;

    // set up event listeners
    setEventListeners(renderer.domElement, client);

    // render update loop
    function renderLoop(timeStamp: number) {
        requestAnimationFrame(renderLoop);
        currentTime = timeStamp - totalTime;
        totalTime = timeStamp;
        fps = 1 / (currentTime / 1000);

        client.render();
    }

    // start the render loop
    renderLoop(0);

    messageHandlerSystem(client);
}