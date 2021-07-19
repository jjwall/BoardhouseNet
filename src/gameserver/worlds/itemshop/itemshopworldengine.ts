import { kenneyItemShop2 } from "../../../modules/tilemapping/tilemaps/kenneyitemshop2";
import { sendPlayerToAnotherWorld } from "../../messaging/sendneteventmessages";
import { getHitbox, HitboxTypes, setHitbox } from "../../components/hitbox";
import { TileMapSchema } from "../../../modules/tilemapping/tilemapschema";
import { TileData, WorldLevelData } from "../../../packets/worldleveldata";
import { BaseWorldEngine } from "../../serverengine/baseworldengine";
import { collisionSystem } from "../../systems/collision";
import { worldEdgeSystem } from "../../systems/worldedge";
import { WorldTypes } from "../../../packets/worldtypes";
import { PositionComponent, setPosition } from "../../components/position";
import { velocitySystem } from "../../systems/velocity";
import { setControls } from "../../components/control";
import { controlSystem } from "../../systems/control";
import { PlayerStates } from "../../components/player"
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
        this.registerSystem(worldEdgeSystem);

        // playAudio("./data/audio/Pale_Blue.mp3", 0.3, true);

        // TODO: Make it where you don't have to do this, delay on entity creation breaks stuff
        // I guess just create other ents first
        let ent = new Entity();
        ent.control = setControls();
        this.registerEntity(ent, server);

        this.worldLevelData = this.registerWorldLevelData(kenneyItemShop2, "./data/textures/colored_packed.png");
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

        this.worldHeight = scaledHeight * worldLevelData.canvasTileMapTilesHigh;
        this.worldWidth = scaledWidth * worldLevelData.canvasTileMapTilesWide;

        tileMapData.layers.forEach(layer => {
            layer.tiles.forEach(tile => {
                const xPos = tile.x * scaledWidth + scaledWidth / 2 - this.worldWidth / 2;
                const yPos = scaledHeight * (worldLevelData.canvasTileMapTilesHigh - 1) - tile.y * scaledHeight + scaledHeight / 2 - this.worldHeight / 2;
                let tileEnt = new Entity();
                tileEnt.pos = setPosition(xPos, yPos, 1);
                
                switch (tile.tile) {
                    case 85: // coat
                    case 86: // coat with hoodie
                    case 87: // boots
                    case 325: // bow 1
                    case 326: // bow 2
                    case 329: // bow 3
                    case 339: // bookshelf
                    case 340: // bookshelf with skull
                    case 344: // table for item display
                    case 345: // closed drawer
                    case 371: // sword 1
                    case 386: // counter end piece (top view)
                    case 387: // counter end piece (side view)
                    case 388: // counter middle piece (side view)
                    case 416: // sword 2
                    case 418: // sword 3
                    case 448: // counter middle piece (top view)
                        tileEnt.hitbox = setHitbox(HitboxTypes.TILE_OBSTACLE, [HitboxTypes.PLAYER], 128, 128);
                        tileEnt.hitbox.onHit = function(tile, other, manifold) {
                            if (other.hitbox.collideType === HitboxTypes.PLAYER) {
                                const tileHitbox = getHitbox(tile);
                                const playerHitbox = getHitbox(other);

                                if (playerHitbox.left > tileHitbox.left) {
                                    if (manifold.width <= manifold.height)
                                        other.pos.loc.x += manifold.width;
                                }
                                if (playerHitbox.right < tileHitbox.right) {
                                    if (manifold.width <= manifold.height)
                                        other.pos.loc.x -= manifold.width;
                                }
                                if (playerHitbox.bottom > tileHitbox.bottom) {
                                    if (manifold.width >= manifold.height)
                                        other.pos.loc.y += manifold.height;
                                }
                                if (playerHitbox.top < tileHitbox.top) {
                                    if (manifold.width >= manifold.height)
                                        other.pos.loc.y -= manifold.height;
                                }
                            }
                        }

                        break;
                    case 876: // red floor mat (to exit shop)
                        tileEnt.hitbox = setHitbox(HitboxTypes.RED_FLOOR_TILE_EXIT_ITEM_SHOP, [HitboxTypes.PLAYER], 10, 128, 0, -50);
                        tileEnt.hitbox.onHit = (tile, other, manifold) => {
                            if (other.hitbox.collideType === HitboxTypes.PLAYER) {
                                console.log("exiting shop...");
                                const playerIndex = this.server.playerClientIds.indexOf(other.player.id);
                                console.log(playerIndex);

                                if (playerIndex > -1) {           
                                    if (other.player.state === PlayerStates.LOADED) {
                                        const castleSpawnPosition: PositionComponent = setPosition(765, -850, 5);
                                        sendPlayerToAnotherWorld(other, this, WorldTypes.CASTLE, castleSpawnPosition);
                                    }
                                }
                            }
                        }
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