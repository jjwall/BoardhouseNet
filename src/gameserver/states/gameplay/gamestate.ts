import { processClientMessages, processQueriedInputs } from "../../messaging/processclientmessages";
import { kenneyFantasy } from "../../../modules/tilemapping/tilemaps/kenneyfantasy";
import { collisionSystem } from "../../systems/collision";
import { setPosition } from "../../components/position";
import { velocitySystem } from "../../systems/velocity";
import { setControls } from "../../components/control";
import { controlSystem } from "../../systems/control";
import { playerSystem } from "../../systems/player";
import { BaseState } from "../../server/basestate";
import { Server } from "./../../server/server";
import { Entity } from "./entity";
import { WorldTypes } from "../../../packets/networldmessage";

/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState extends BaseState {
    // public rootWidget: Widget;
    constructor(server: Server, worldType: WorldTypes) {
        super(server, worldType);
        // Set up ui widget and instance.
        // this.rootWidget = createWidget("root");
        // let rootComponent = renderGameUi(this.uiScene, this.rootWidget);

        // Register systems.
        this.registerSystem(controlSystem, "control");
        this.registerSystem(playerSystem, "player");
        this.registerSystem(velocitySystem);
        this.registerSystem(collisionSystem);

        // playAudio("./data/audio/Pale_Blue.mp3", 0.3, true);

        // TODO: Make it where you don't have to do this, delay on entity creation breaks stuff
        // I guess just create other ents first
        let ent = new Entity();
        ent.control = setControls();
        this.registerEntity(ent, server);

        let cottage1 = new Entity();
        cottage1.pos = setPosition(150, 450, 5);
        cottage1.sprite = { url: "./data/textures/cottage.png", pixelRatio: 4 };
        let cottage2 = new Entity();
        cottage2.pos = setPosition(450, 450, 5);
        cottage2.sprite = { url: "./data/textures/cottage.png", pixelRatio: 4 };
    
        this.registerEntity(cottage1, server);
        this.registerEntity(cottage2, server);
    }

    // Register tiles for hit colision / traps.
    // TO DO - Add hit collision
    // TO DO - make this work...
    private registerTileMap() : void {
        const tileHeight: number = 16;
        const tileWidth: number  = 16;

        kenneyFantasy.layers.forEach(layer => {
            layer.tiles.forEach(tile => {
                let tileEnt = new Entity();
                tileEnt.pos = setPosition(tile.x*tileWidth, tile.y*tileHeight, 1);
                this.registerEntity(tileEnt, this.server);
            });
        });
    }

    public update() : void {
        processClientMessages(this.getEntitiesByKey<Entity>("player"), this.server);
        // processQueriedInputs(this.getEntitiesByKey<Entity>("player"), this.server, this);
        this.runSystems();
    }
}