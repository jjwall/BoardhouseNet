import { BaseState } from "../../engine/basestate";
import { initializeControls } from "../../components/initializers";
import { controlSystem } from "../../systems/coresystems";
import { Entity } from "./entity";
import { IBoardhouseBack } from "../../engine/interfaces";
import { processMessages } from "../../messaging/processmessages";

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
        this.registerSystem(controlSystem, "control");
        // this.registerSystem(positionSystem);

        // playAudio("./data/audio/Pale_Blue.mp3", 0.3, true);

        // TODO: Make it where you don't have to do this, delay on entity creation breaks stuff
        // I guess just create other ents first
        let ent = new Entity();
        ent.control = initializeControls();
        this.registerEntity(ent, boardhouseBack);
    }

    public update() : void {
        processMessages(this.getEntitiesByKey<Entity>("global"), this.boardhouseBack, this)
        this.runSystems();
    }
}