import { kenneyFantasy2 } from "../../../modules/tilemapping/tilemaps/kenneyfantasy2";
import { TileData, WorldLevelData } from "../../../packets/data/worldleveldata";
import { getHitbox, HitboxTypes, setHitbox } from "../../components/hitbox";
import { TileMapSchema } from "../../../modules/tilemapping/tilemapschema";
import { PositionComponent, setPosition } from "../../components/position";
import { transitionPlayerToAnotherWorld } from "../../messaging/helpers";
import { BaseWorldEngine } from "../../serverengine/baseworldengine";
import { WorldTypes } from "../../../packets/enums/worldtypes";
import { worldEdgeSystem } from "../../systems/worldedge";
import { collisionSystem } from "../../systems/collision";
import { velocitySystem } from "../../systems/velocity";
import { PlayerStates } from "../../components/player";
import { setControls } from "../../components/control";
import { controlSystem } from "../../systems/control";
import { playerSystem } from "../../systems/player";
import { Server } from "../../serverengine/server";
import { Entity } from "../../serverengine/entity";

/**
 * World engine that handles updating of all world-related systems.
 */
export class CastleWorldEngine extends BaseWorldEngine {
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

        let cottage1 = new Entity();
        cottage1.pos = setPosition(150, 450, 5);
        cottage1.sprite = { url: "./data/textures/cottage.png", pixelRatio: 4 };
        let cottage2 = new Entity();
        cottage2.pos = setPosition(450, 450, 5);
        cottage2.sprite = { url: "./data/textures/cottage.png", pixelRatio: 4 };
    
        this.registerEntity(cottage1, server);
        this.registerEntity(cottage2, server);

        this.worldLevelData = this.registerWorldLevelData(kenneyFantasy2, "./data/textures/colored_packed.png");
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
                    case 149: // steel fence
                    case 200: // straight river
                    case 201: // river turn 
                    case 245: // steel fence
                    case 529: // stone stairs
                    case 533: // red roof
                    case 534: // red roof
                    case 535: // red roof
                    case 576: // square stone wall topper
                    case 577: // pyramid stone wall topper
                    case 578: // stone wall with cross window
                    case 581: // red slanted roof (left)
                    case 582: // red roof
                    case 583: // red slanted roof (right)
                    case 592: // stone pile
                    case 624: // stone wall
                    case 625: // stone wall with bar window
                    case 631: // red wall with window
                    case 676: // well
                    case 727: // red brick wall
                    case 730: // wooden slanted roof (left)
                    case 731: // wooden roof
                    case 732: // wooden slanted roof (right)
                    case 778: // wooden wall with window (left)
                    case 780: // wooden wall with window (right)
                    case 827: // stone wall with square window
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

                    case 435: // inn door (use for item shop?)
                        // teleport player into item shop world
                        tileEnt.hitbox = setHitbox(HitboxTypes.INN_DOOR, [HitboxTypes.PLAYER], 10, 128, 0, 50);
                        tileEnt.hitbox.onHit = (tile, other, manifold) => {
                            if (other.hitbox.collideType === HitboxTypes.PLAYER) {
                                console.log("exiting castle...");
                                const playerIndex = this.server.playerClientIds.indexOf(other.player.id);
                                console.log(playerIndex);

                                if (playerIndex > -1) {           
                                    if (other.player.state === PlayerStates.LOADED) {
                                        const itemShopSpawnPosition: PositionComponent = setPosition(0, -500, 5);
                                        transitionPlayerToAnotherWorld(other, this, WorldTypes.ITEM_SHOP, itemShopSpawnPosition);
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