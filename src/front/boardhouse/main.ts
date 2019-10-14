import { Resources, loadTextures, loadAudioElements, loadFonts } from "./resourcemanager";
import { setEventListeners } from "./seteventlisteners";
import { WebGLRenderer } from "three";

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

loadTextures([
    "./data/textures/cottage.png",
    "./data/textures/msknight.png",
    "./data/textures/snow.png",
]).then((textures) => {
    // cache off textures
    Resources.instance.setTextures(textures);

    loadFonts([
        "./data/fonts/helvetiker_regular_typeface.json"
    ]).then((fonts) => {
        // cache off fonts
        Resources.instance.setFonts(fonts);

        loadAudioElements([
            "./data/audio/Pale_Blue.mp3"
        ]).then((audioElements) => {
            // cache off audio elements
            Resources.instance.setAudioElements(audioElements);

            // start game
            main(<HTMLElement>document.getElementById("canvasContainer"));
        });
    });
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
    renderer.setSize(1280, 720);
    renderer.autoClear = false;

    // append canvas element to canvas container
    canvasContainer.append(renderer.domElement);

    // initialize state stack
    // let stateStack: BaseState[] = [];
    // let mainMenuState = new MainMenuState(stateStack);
    // stateStack.push(mainMenuState);
    // let gameState = new GameState(stateStack);
    // stateStack.push(gameState);

    let fps: number = 0;
    let totalTime: number = 0;
    let currentTime: number = 0;
    // let fpsWidget = BoardhouseUI.CreateWidget();
    // fpsWidget.setText("FPS:");

    // set up event listeners
    setEventListeners(renderer.domElement);

    // logic update loop
    // setInterval(function (): void {
    //     if (stateStack.length > 0) {
    //         // call update on last element in state stack
    //         last(stateStack).update();
    //     }
    //     else {
    //         throw "No states to update";
    //     }

        // log FPS
        // fpsWidget.setText("FPS: " + Math.round(fps));
        // BoardhouseUI.ReconcilePixiDom(fpsWidget, app.stage);
    // }, 16);

    // render update loop
    function renderLoop(timeStamp: number) {
        requestAnimationFrame(renderLoop);
        currentTime = timeStamp - totalTime;
        totalTime = timeStamp;
        fps = 1 / (currentTime / 1000);
                
        // if (stateStack.length > 0) {
            // call render on last element in state stack
            // last(stateStack).render(renderer);
        // }
        // else {
            // throw "No states to render";
        // }
    }

    // start the render loop
    renderLoop(0);
}