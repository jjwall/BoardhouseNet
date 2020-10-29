import { Scene, Camera, Color, WebGLRenderer, OrthographicCamera } from "three";
import { BaseClientState } from "../engine/baseclientstate";
import { ClientEngine } from "../engine/clientengine";

export class ClientState extends BaseClientState {
    public gameScene: Scene;
    public gameCamera: Camera;
    public uiScene: Scene;
    public uiCamera: Camera;
    public entityList: ClientEntity[] = [];
    constructor(engine: ClientEngine) {
        super(engine);
        console.log("initializing client game play state");
        // Set up game scene.
        this.gameScene = new Scene();
        this.gameScene.background = new Color("#FFFFFF");

        // Set up game camera.
        this.gameCamera = new OrthographicCamera(0, engine.screenWidth, engine.screenHeight, 0, -1000, 1000);

        // Set up ui scene.
        this.uiScene = new Scene();

        // Set up ui camera.
        this.uiCamera = new OrthographicCamera(0, engine.screenWidth, 0, -engine.screenHeight, -1000, 1000);
    }

    public handleEvent(e: Event) : void {
        switch(e.type) {
            // case EventTypes.POINTER_DOWN:
            //     handlePointerDownEvent(this.rootWidget, e as PointerEvent);
            //      break;
            // case EventTypes.POINTER_UP:
            //     handlePointerUpEvent(e as PointerEvent);
            //     break;
            // case EventTypes.MOUSE_DOWN:
            //     handleMouseDownEvent(this.rootWidget, e as MouseEvent);
            //     break;
            // case EventTypes.MOUSE_UP:
            //     handleMouseUpEvent(e as MouseEvent);
            //     break;
            // case EventTypes.KEY_DOWN:
            //     handleKeyDownEvent(this, e as KeyboardEvent);
            //     break;
            // case EventTypes.KEY_UP:
            //     handleKeyUpEvent(this, e as KeyboardEvent);
            //     break;
        }
    }

    public render() : void {
        this.engine.renderer.clear();
        this.engine.renderer.render(this.gameScene, this.gameCamera);
        this.engine.renderer.clearDepth();
        this.engine.renderer.render(this.uiScene, this.uiCamera);

        // Render UI updates. // -> set up later
        // layoutWidget(this.rootWidget, this.engine);
    }
}