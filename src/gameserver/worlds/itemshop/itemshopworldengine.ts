import { kenneyItemShop } from "../../../modules/tilemapping/tilemaps/kenneyitemshop";
import { TileMapSchema } from "../../../modules/tilemapping/tilemapschema";
import { TileData, WorldLevelData } from "../../../packets/worldleveldata";
import { BaseWorldEngine } from "../../serverengine/baseworldengine";
import { HitboxTypes, setHitbox } from "../../components/hitbox";
import { WorldTypes } from "../../../packets/networldmessage";
import { collisionSystem } from "../../systems/collision";
import { setPosition } from "../../components/position";
import { velocitySystem } from "../../systems/velocity";
import { setControls } from "../../components/control";
import { controlSystem } from "../../systems/control";
import { playerSystem } from "../../systems/player";
import { Server } from "../../serverengine/server";
import { Entity } from "../../serverengine/entity";

/**
 * World engine that handles updating of all world-related systems.
 */
export class ItemShopWorldEngine extends BaseWorldEngine {
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

        this.worldLevelData = this.registerWorldLevelData(kenneyItemShop, "./data/textures/colored_packed.png");
    }

    public registerWorldLevelData(tileMapData: TileMapSchema, tileSetTextureUrl: string): WorldLevelData {
        const worldLevelData: WorldLevelData = {
            worldType: this.worldType,
            levelTextureUrl: tileSetTextureUrl,
            pixelRatio: 8,
            tileWidth: tileMapData.tilewidth,
            tileHeight: tileMapData.tileheight,
            canvasTileSetTilesWide: 48,
            canvasTileSetTilesHigh: 22,
            canvasTileMapTilesWide: tileMapData.tileswide,
            canvasTileMapTilesHigh: tileMapData.tileshigh,
            tiles: [],
        }

        const scaledWidth = worldLevelData.tileWidth * worldLevelData.pixelRatio;
        const scaledHeight = worldLevelData.tileHeight * worldLevelData.pixelRatio;

        const worldHeight = scaledHeight * worldLevelData.canvasTileMapTilesHigh;
        const worldWidth = scaledWidth * worldLevelData.canvasTileMapTilesWide;

        tileMapData.layers.forEach(layer => {
            layer.tiles.forEach(tile => {
                const xPos = tile.x * scaledWidth + scaledWidth / 2 - worldWidth / 2;
                const yPos = scaledHeight * (worldLevelData.canvasTileMapTilesHigh - 1) - tile.y * scaledHeight + scaledHeight / 2 - worldHeight / 2;
                let tileEnt = new Entity();
                tileEnt.pos = setPosition(xPos, yPos, 1);
                
                switch (tile.tile) {
                    case 48: // single pine tree
                    case 99: // double pine trees
                        tileEnt.hitbox = setHitbox(HitboxTypes.TILE_OBSTACLE, [HitboxTypes.PLAYER], 128, 128);
                        break;
                }

                const tileData: TileData = {
                    tileNumber: tile.tile,
                    xPos: xPos,
                    yPos: yPos,
                    rot: tile.rot,
                    flipX: tile.flipX,
                }

                // Set up hitbox data if exists for displaying hitbox graphics if needed for testing.
                if (tileEnt.hitbox) {
                    tileData.hitbox = {
                        height: tileEnt.hitbox.height,
                        width: tileEnt.hitbox.width,
                        offsetX: tileEnt.hitbox.offsetX,
                        offsetY: tileEnt.hitbox.offsetY,
                    }
                }

                worldLevelData.tiles.push(tileData);
                this.registerEntity(tileEnt, this.server);
            });
        });

        console.log(`World Level Data for WorldType = "${worldLevelData.worldType}" registered.`);

        return worldLevelData;
    }

    public update() : void {
        this.runSystems();
    }
}