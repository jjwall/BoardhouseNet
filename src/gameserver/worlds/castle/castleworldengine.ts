import { createEntitySpawnArea, SpawnAreaParams } from "../../archetypes/entityspawnarea";
import { kenneyFantasy2 } from "../../../modules/tilemapping/tilemaps/kenneyfantasy2";
import { TileData, WorldLevelData } from "../../../packets/data/worldleveldata";
import { getHitbox, HitboxTypes, setHitbox } from "../../components/hitbox";
import { TileMapSchema } from "../../../modules/tilemapping/tilemapschema";
import { PositionComponent, setPosition } from "../../components/position";
import { SequenceTypes } from "../../../modules/animations/sequencetypes";
import { fishAnim } from "../../../modules/animations/animationdata/fish";
import { transitionPlayerToAnotherWorld } from "../../messaging/helpers";
import { BaseWorldEngine } from "../../serverengine/baseworldengine";
import { WorldTypes } from "../../../packets/enums/worldtypes";
import { skillSlotsSystem } from "../../systems/skillslots";
import { worldEdgeSystem } from "../../systems/worldedge";
import { collisionSystem } from "../../systems/collision";
import { velocitySystem } from "../../systems/velocity";
import { PlayerStates } from "../../components/player";
import { setMovement } from "../../components/movement";
import { movementSystem } from "../../systems/movement";
import { behaviorSystem } from "../../systems/behavior";
import { createGoblin } from "../../archetypes/goblin";
import { followSystem } from "../../systems/follow";
import { playerSystem } from "../../systems/player";
import { Server } from "../../serverengine/server";
import { Entity } from "../../serverengine/entity";
import { timerSystem } from "../../systems/timer";
import { Vector3 } from "three";

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
        this.registerSystem(movementSystem, "movement");
        this.registerSystem(playerSystem, "player");
        this.registerSystem(velocitySystem);
        this.registerSystem(collisionSystem);
        this.registerSystem(worldEdgeSystem);
        this.registerSystem(skillSlotsSystem);
        this.registerSystem(behaviorSystem);
        this.registerSystem(timerSystem);
        this.registerSystem(followSystem);

        // playAudio("./assets/audio/Pale_Blue.mp3", 0.3, true);

        // TODO: Make it where you don't have to do this, delay on entity creation breaks stuff
        // I guess just create other ents first
        let ent = new Entity();
        ent.movement = setMovement();
        this.registerEntity(ent, server);

        let magicCircle = new Entity();
        magicCircle.pos = setPosition(450, 250, 3, new Vector3(1, -1, 0));
        magicCircle.sprite = { url: "./assets/textures/vfx/magic_circle.png", pixelRatio: 1 };
        let fish = new Entity();
        fish.pos = setPosition(1400, 250, 3);
        fish.sprite = { url: "./assets/textures/npcs/fish/fish001.png", pixelRatio: 4 };
        fish.anim = { sequence: SequenceTypes.IDLE, blob: fishAnim };
        fish.hitbox = setHitbox(HitboxTypes.FISH_MOUTH, [HitboxTypes.PLAYER_SWORD_ATTACK], 10, 10, 15, -2);
        fish.hitbox.onHit = (tile, other, manifold) => {
            console.log("IS THIS GONNA HIT???")
        }

        const goblinSpawnArea1: SpawnAreaParams = {
            pos: setPosition(-350, 625, 4),
            areaHeight: 850,
            areaWidth: 250,
            maxNumberOfEntities: 5,
            createEntityArchetypes: [createGoblin],
            worldEngine: this,
        }

        createEntitySpawnArea(goblinSpawnArea1);

        // this.registerEntity(cottage1, server);
        // this.registerEntity(cottage2, server);
        this.registerEntity(magicCircle, server);
        this.registerEntity(fish, server);

        this.worldLevelData = this.registerWorldLevelData(kenneyFantasy2, "./assets/textures/tilesets/colored_packed.png");
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
                        tileEnt.hitbox = setHitbox(HitboxTypes.TILE_OBSTACLE, [HitboxTypes.PLAYER, HitboxTypes.ENEMY], 128, 128);
                        tileEnt.hitbox.onHit = function(tile, other, manifold) {
                            if (other.hitbox.collideType === HitboxTypes.PLAYER
                                || other.hitbox.collideType === HitboxTypes.ENEMY) {
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