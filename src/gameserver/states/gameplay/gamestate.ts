import { BaseState } from "../../server/basestate";
import { initializeControls } from "../../components/initializers";
import { controlSystem } from "../../systems/coresystems";
import { Entity } from "./entity";
import { processClientMessages } from "../../messaging/processclientmessages";
import { Server } from "./../../server/server";

/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState extends BaseState {
    // public rootWidget: Widget;
    constructor(server: Server) {
        super(server);
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
        this.registerEntity(ent, server);

        let cottage1 = new Entity();
        cottage1.pos = { x: 150, y: 450, z: 5 };
        cottage1.sprite = { url: "./data/textures/cottage.png", pixelRatio: 4 };
        let cottage2 = new Entity();
        cottage2.pos = { x: 450, y: 450, z: 5 };
        cottage2.sprite = { url: "./data/textures/cottage.png", pixelRatio: 4 };
    
        this.registerEntity(cottage1, server);
        this.registerEntity(cottage2, server);
    }

    public update() : void {
        processClientMessages(this.getEntitiesByKey<Entity>("global"), this.server, this)
        this.runSystems();
    }
}