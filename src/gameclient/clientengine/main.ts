import { sendPlayerWorldJoinMessage, sendSpectatorWorldJoinMessage } from "../messaging/sendclientworldmessages";
import { setEventListeners } from "./seteventlisteners";
import { OrthographicCamera, WebGLRenderer, Scene, Color } from "three";
import { processNetMessages } from "../messaging/processnetmessages";
import { Client, ClientConfig } from "./client";
import { GameServerStateTypes } from "../../packets/enums/gameserverstatetypes";
import { ClientRoleTypes } from "../../packets/enums/clientroletypes";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { WorldTypes } from "../../packets/enums/worldtypes";

// TODO:
// > Clean up Client class fields and config fields
// > (Done) Set up event handling so only player roles can trigger them
// -> Player roles shouldn't have access to start sending packets until player's entity
// has been created on back end.
// Maybe make a client status? readyToSendMessages boolean?
// > (Done) Start working on creating / destroying / and updating front end entities in messagehandlersystem
// > Reconfigure "packets" directory
// -> probably name it "middleware"
// -> have a new "packets" dir in there as well as a "enums" dir in there
// -> consider putting modules like setUpClientToLobbyConnection.ts in there

const params = <URLSearchParams> new URLSearchParams(window.location.search);

const config: ClientConfig = {
    role: params.get("clientRole") as ClientRoleTypes, // Role would change how event handling works. Only need player sending key press events for example.
    playerClass: params.get("playerClass") as PlayerClassTypes,
    worldType: params.get("worldType") as WorldTypes,
    connection: <WebSocket> null,
    currentPort: <number>parseInt(params.get("port")),
    currentClientId: params.get("clientId"),
    hostName: <string>window.location.hostname != "" ? window.location.hostname : "localhost",
    // netIdToEntMap: Array<NetIdToEntMap> // TODO: Implement!! (FrontEnt vs BackEnt, EntData is separate)
    /// ----
    screenWidth: 1280,
    screenHeight: 720,
    // gameTicksPerSecond: 60,
    // displayFPS: true,
    displayHitBoxes: false,
    // globalErrorHandling: true,
    fontUrls: [
        "./data/fonts/helvetiker_regular_typeface.json"
    ],
    textureUrls: [
        "./data/textures/cottage.png",
        "./data/textures/msknight.png",
        "./data/textures/snow.png",
        "./data/textures/mediumExplosion1.png",
        "./data/textures/archer_girl_from_sketch.png",
        "./data/textures/colored_packed.png",
        "./data/textures/magic_circle.png",
        "./data/textures/necrowalk1.png",
        "./data/textures/necrowalk2.png",
        "./data/textures/necrowalk3.png",
        "./data/textures/necroattack1.png",
        "./data/textures/necroattack2.png",
        "./data/textures/unholyblast1.png",
        "./data/textures/unholyblast2.png",
        "./data/textures/unholyblast3.png",
        "./data/textures/zelfin001.png",
        "./data/textures/zelfin002.png",
        "./data/textures/zelfin003.png",
        "./data/textures/zelfin004.png",
        "./data/textures/zelfin005.png",
        "./data/textures/zelfin006.png",
        "./data/textures/zelfin007.png",
        "./data/textures/zelfin008.png",
        "./data/textures/basic_sword_attack001.png",
        "./data/textures/basic_sword_attack002.png",
        "./data/textures/basic_sword_attack003.png",
        "./data/textures/basic_sword_attack004.png",
        "./data/textures/fish001.png",
        "./data/textures/fish002.png",
    ],
    audioUrls: [
        "./data/audio/Pale_Blue.mp3",
    ],
}

// Remove url params.
window.history.replaceState(null, null, window.location.pathname);

const client = new Client(config);

client.connection = new WebSocket("ws://" + 
                                           client.hostName + ":" +
                                           client.currentPort);

client.connection.onopen = function() {
    switch (client.role) {
        case ClientRoleTypes.PLAYER:
            sendPlayerWorldJoinMessage(client);
            break;
        case ClientRoleTypes.SPECTATOR:
            sendSpectatorWorldJoinMessage(client);
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

    processNetMessages(client);
}