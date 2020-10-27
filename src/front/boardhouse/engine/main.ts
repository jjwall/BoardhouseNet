import { setEventListeners } from "./seteventlisteners";
import { OrthographicCamera, WebGLRenderer, Scene, Color } from "three";
import { messageHandlerSystem } from "../messaging/messagehandlersystem";
import { PlayerMessage } from "../../../packets/playermessage";
import { PlayerEventTypes } from "../../../packets/playereventtypes";
import { FrontEngine, FrontEngineConfig } from "./frontengine";
import { FrontGamePlayState } from "../states/gameplay/frontstate";
import { last } from "./helpers";

const params = <URLSearchParams> new URLSearchParams(window.location.search);

const config: FrontEngineConfig = {
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

const engine = new FrontEngine(config);

engine.connection = new WebSocket("ws://" + 
                                           engine.hostName + ":" +
                                           engine.currentPort);

engine.connection.onopen = function() {
    console.log("conn opened");

    const message: PlayerMessage = {
        eventType: PlayerEventTypes.PLAYER_JOINED,
        playerId: engine.currentPlayerId
    }
    
    engine.connection.send(JSON.stringify(message));
}

engine.loadAssets().then(() => {
    const gamePlayState = new FrontGamePlayState(engine);
    engine.stateStack.push(gamePlayState);
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
    renderer.setSize(engine.screenWidth, engine.screenHeight);
    renderer.autoClear = false;
    engine.renderer = renderer;

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
    setEventListeners(renderer.domElement, engine);

    // render update loop
    function renderLoop(timeStamp: number) {
        requestAnimationFrame(renderLoop);
        currentTime = timeStamp - totalTime;
        totalTime = timeStamp;
        fps = 1 / (currentTime / 1000);
                
        if (engine.stateStack.length > 0) {
            // call render on last element in state stack
            last(engine.stateStack).render();
        }
        else {
            throw "No states to render";
        }
    }

    // start the render loop
    renderLoop(0);


    messageHandlerSystem(engine);
}