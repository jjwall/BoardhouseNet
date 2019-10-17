import { BaseState } from "./basestate";
import { initializeControls } from "./initializers";
import { controlSystem } from "./coresystems";
import { Entity } from "./entity";
import { IBoardhouseBack } from "./interfaces";
import { processMessages } from "./processmessages";

/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState extends BaseState {
    // public rootWidget: Widget;
    boardhouseBack: IBoardhouseBack;
    constructor(stateStack: BaseState[], boardhouseBack :IBoardhouseBack) {
        super(stateStack);
        this.boardhouseBack = boardhouseBack;
        // Set up ui widget and instance.
        // this.rootWidget = createWidget("root");
        // let rootComponent = renderGameUi(this.uiScene, this.rootWidget);

        // Register systems.
        // this.registerSystem(controlSystem, "control");
        // this.registerSystem(positionSystem);

        // playAudio("./data/audio/Pale_Blue.mp3", 0.3, true);

    }

    public update() : void {
        processMessages(this.getEntitiesByKey<Entity>("global"), this.boardhouseBack, this)
        this.runSystems();
    }
}