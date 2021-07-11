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
import { TileMapSchema } from "../../../modules/tilemapping/tilemapschema";
import { TileData, WorldLevelData } from "../../../packets/worldleveldata";

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

        this.registerWorldLevelData(kenneyFantasy, "./data/textures/colored_packed.png");
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

    public registerWorldLevelData(tileMapData: TileMapSchema, tileSetTextureUrl: string): void {
        let worldLevelData: WorldLevelData = {
            worldType: this.worldType,
            levelTextureUrl: tileSetTextureUrl,
            pixelRatio: 8,
            tileWidth: 16, // tileMapData.tilewidth,
            tileHeight: 16, // tileMapData.tileheight
            canvasTileSetTilesWide: 48,
            canvasTileSetTilesHigh: 22,
            canvasTileMapTilesWide: tileMapData.tileswide,
            canvasTileMapTilesHigh: tileMapData.tileshigh,
            tiles: [],
        }

        const scaledWidth = worldLevelData.tileWidth * worldLevelData.pixelRatio;
        const scaledHeight = worldLevelData.tileHeight * worldLevelData.pixelRatio;

        tileMapData.layers.forEach(layer => {
            layer.tiles.forEach(tile => {
                let tileEnt = new Entity();
                const xPos = tile.x*scaledWidth + scaledWidth/2;
                const yPos = scaledHeight*worldLevelData.canvasTileSetTilesHigh - tile.y * scaledHeight + scaledHeight/2
                tileEnt.pos = setPosition(xPos, yPos, 1);
                
                // switch (tile.tile) {
                //     case 99:
                //         // tileEnt.hitbox = ...
                //         break;
                //     case 1: //
                // }
                const tileData: TileData = {
                    tileNumber: tile.tile,
                    // xIndex: tile.x,
                    // yIndex: tile.y,
                    xPos: xPos,
                    yPos: yPos,
                    rot: tile.rot,
                    flipX: tile.flipX,
                }

                worldLevelData.tiles.push(tileData);

                this.registerEntity(tileEnt, this.server);
            });
        });

        this.worldLevelData = worldLevelData;
        console.log(`World Level Data for WorldType = "${worldLevelData.worldType}" registered.`);
    }

    public update() : void {
        this.runSystems();
    }
}