import { setEventListeners } from "./seteventlisteners";
import { OrthographicCamera, WebGLRenderer, Scene, Color } from "three";
import { messageHandlerSystem } from "../messaging/messagehandlersystem";
import { PlayerMessage } from "../../packets/playermessage";
import { PlayerEventTypes } from "../../packets/playereventtypes";
import { ClientStateMachine, ClientStateMachineConfig } from "./clientstatemachine";
// import { ClientState } from "../state/clientstate";
import { last } from "./helpers";

const params = <URLSearchParams> new URLSearchParams(window.location.search);

const config: ClientStateMachineConfig = {
    clientRole: "Player" || "Specatator", // would not be determined here. But role would change how event handling works. Only need player sending key press events for example. Maybe if playerId then player else specator. Set up ClientRole type enum.
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

const stateMachine = new ClientStateMachine(config);

stateMachine.connection = new WebSocket("ws://" + 
                                           stateMachine.hostName + ":" +
                                           stateMachine.currentPort);

stateMachine.connection.onopen = function() {
    console.log("conn opened");

    const message: PlayerMessage = {
        eventType: PlayerEventTypes.PLAYER_JOINED,
        playerId: stateMachine.currentPlayerId
    }
    
    stateMachine.connection.send(JSON.stringify(message));
}

stateMachine.loadAssets().then(() => {
    stateMachine.initializeState("gameplay");
    //engine.stateStack.push(state); // keep stateStack for now.. maybe remove later
    // prob don't need statestack, you would just pass state to main, and not have 
    // a reference to state on the engine, since you'd have a reference to engine on the state
    // no need for a cyclical reference
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
    renderer.setSize(stateMachine.screenWidth, stateMachine.screenHeight);
    renderer.autoClear = false;
    stateMachine.renderer = renderer;

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
    setEventListeners(renderer.domElement, stateMachine);

    // render update loop
    function renderLoop(timeStamp: number) {
        requestAnimationFrame(renderLoop);
        currentTime = timeStamp - totalTime;
        totalTime = timeStamp;
        fps = 1 / (currentTime / 1000);

        stateMachine.render();
    }

    // start the render loop
    renderLoop(0);

    messageHandlerSystem(stateMachine);
}