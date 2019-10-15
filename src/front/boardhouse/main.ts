import { Resources, loadTextures, loadAudioElements, loadFonts } from "./resourcemanager";
import { setEventListeners } from "./seteventlisteners";
import { OrthographicCamera, WebGLRenderer, Scene, Color } from "three";
import { IBoardHouseFront } from "./interfaces";
import { messageHandlerSystem } from "./messagehandlersystem";

const params = <URLSearchParams> new URLSearchParams(window.location.search);

const boardhouseFront: IBoardHouseFront = {
    connection: <WebSocket> null,
    currentPort: <number>parseInt(params.get("port")),
    currentLoginUserId: <number>parseInt(params.get("loginUserId")),
    hostName: <string>window.location.hostname != "" ? window.location.hostname : "localhost",
    gameScene: new Scene(),
    gameCamera: new OrthographicCamera(0, 1280, 720, 0, -1000, 1000),
}

boardhouseFront.connection = new WebSocket("ws://" + 
                                           boardhouseFront.hostName + ":" +
                                           boardhouseFront.currentPort);

boardhouseFront.connection.onopen = function() {
    console.log("conn opened");
}

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
    boardhouseFront.gameScene.background = new Color("#FFFFFF");

    // append canvas element to canvas container
    canvasContainer.append(renderer.domElement);

    let fps: number = 0;
    let totalTime: number = 0;
    let currentTime: number = 0;
    // let fpsWidget = BoardhouseUI.CreateWidget();
    // fpsWidget.setText("FPS:");

    // set up event listeners
    setEventListeners(renderer.domElement, boardhouseFront);

    // render update loop
    function renderLoop(timeStamp: number) {
        requestAnimationFrame(renderLoop);
        currentTime = timeStamp - totalTime;
        totalTime = timeStamp;
        fps = 1 / (currentTime / 1000);
                
        render(renderer);
    }

    // start the render loop
    renderLoop(0);

    function render(renderer: WebGLRenderer) {
        renderer.clear();
        renderer.render(boardhouseFront.gameScene, boardhouseFront.gameCamera);
    }

    messageHandlerSystem(boardhouseFront);
}