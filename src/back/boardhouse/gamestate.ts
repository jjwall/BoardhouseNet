import { BaseState } from "./basestate";
import { initializeControls } from "./initializers";
import { controlSystem } from "./coresystems";
import { Entity } from "./entity";

/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState extends BaseState {
    // public rootWidget: Widget;
    constructor(stateStack: BaseState[]) {
        super(stateStack);
        // Set up ui widget and instance.
        // this.rootWidget = createWidget("root");
        // let rootComponent = renderGameUi(this.uiScene, this.rootWidget);

        // Register systems.
        this.registerSystem(controlSystem, "control");
        // this.registerSystem(positionSystem);

        // playAudio("./data/audio/Pale_Blue.mp3", 0.3, true);

        // Set up player entity.
        let player = new Entity();
        player.pos = { x: 500, y: 300 };
        player.sprite = { url: "./data/textures/msknight.png", pixelRatio: 4 };
        player.control = initializeControls();

        this.registerEntity(player);
    }

    public update() : void {
        this.runSystems();
    }
}