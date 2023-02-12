import { createEntitySpawnArea, SpawnAreaParams } from "../../archetypes/entityspawnarea";
import { ravenFantasyForest_1_1 } from "../../../modules/tilemapping/tilemaps/ravenfantasyforest_1_1";
import { itemPickupArrowAnim } from "../../../modules/animations/animationdata/itempickuparrow";
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
import { setAnim } from "../../components/animation";
import { setSprite } from "../../components/sprite";
import { playerSystem } from "../../systems/player";
import { Server } from "../../serverengine/server";
import { Entity } from "../../serverengine/entity";
import { timerSystem } from "../../systems/timer";
import { Vector3 } from "three";
import { createItemDrop } from "../../archetypes/itemdrop";
import { ItemData } from "../../../packets/data/itemdata";

export class Forest_1_1 extends BaseWorldEngine {
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

        const swordItemDropPos = setPosition(450, 250, 3);
        const swordItemData: ItemData = {
            spriteUrl: "./data/textures/icons/d20.png",
            onDragSpriteUrl: "./data/textures/icons/d20.png"
        }
        createItemDrop(this, swordItemDropPos, swordItemData);

        const bowItemDropPos = setPosition(650, 250, 3);
        const bowItemData: ItemData = {
            spriteUrl: "./data/textures/icons/d3403.png",
            onDragSpriteUrl: "./data/textures/icons/d3403.png"
        }
        createItemDrop(this, bowItemDropPos, bowItemData);

        // playAudio("./data/audio/Pale_Blue.mp3", 0.3, true);

        // TODO: Make it where you don't have to do this, delay on entity creation breaks stuff
        // I guess just create other ents first
        let ent = new Entity();
        ent.movement = setMovement();
        this.registerEntity(ent, server);

        this.worldLevelData = this.registerWorldLevelData(ravenFantasyForest_1_1, "./data/textures/tilesets/raven_fantasy_green_forest_16x16.png");
    }

    public registerWorldLevelData(tileMapData: TileMapSchema, tileSetTextureUrl: string): WorldLevelData {
        const worldLevelData: WorldLevelData = {
            worldType: this.worldType,
            levelTextureUrl: tileSetTextureUrl,
            pixelRatio: 4,
            tileWidth: tileMapData.tilewidth,
            tileHeight: tileMapData.tileheight,
            canvasTileSetTilesWide: 26,
            canvasTileSetTilesHigh: 15,
            canvasTileMapTilesWide: tileMapData.tileswide,
            canvasTileMapTilesHigh: tileMapData.tileshigh,
            tiles: [],
        }

        const scaledWidth = worldLevelData.tileWidth * worldLevelData.pixelRatio;
        const scaledHeight = worldLevelData.tileHeight * worldLevelData.pixelRatio;

        this.worldHeight = scaledHeight * worldLevelData.canvasTileMapTilesHigh;
        this.worldWidth = scaledWidth * worldLevelData.canvasTileMapTilesWide;

        tileMapData.layers.sort(function(a, b) {
            return b.number - a.number;
        });

        tileMapData.layers.forEach(layer => {
            layer.tiles.forEach(tile => {
                // Skip "empty" tiles.
                if (tile.tile !== -1) {
                    const xPos = tile.x * scaledWidth + scaledWidth / 2 - this.worldWidth / 2;
                    const yPos = scaledHeight * (worldLevelData.canvasTileMapTilesHigh - 1) - tile.y * scaledHeight + scaledHeight / 2 - this.worldHeight / 2;
                    let tileEnt = new Entity();
                    tileEnt.pos = setPosition(xPos, yPos, 1);// layer.number);
                    
                    switch (tile.tile) {
                        case 130: // part of tree
                        case 131: // part of tree
                        case 132: // part of tree
                        case 156: // part of tree
                        case 157: // part of tree
                        case 158: // part of tree
                        case 182: // part of tree
                        case 183: // part of tree
                        case 184: // part of tree
                        case 208: // part of tree
                        case 209: // part of tree
                        case 210: // part of tree
                        case 23: // part of river
                        case 24: // part of river
                        case 25: // part of river
                        case 40: // part of river
                        case 49: // part of river
                        case 179: // part of river
                        case 180: // part of river
                        case 181: // part of river
                        case 205: // part of river
                        case 206: // part of river
                        case 207: // part of river
                            tileEnt.hitbox = setHitbox(HitboxTypes.TILE_OBSTACLE, [HitboxTypes.PLAYER, HitboxTypes.ENEMY], 64, 64);
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
                }
            });
        });

        console.log(`World Level Data for WorldType = "${worldLevelData.worldType}" registered.`);

        return worldLevelData;
    }

    public update() : void {
        this.runSystems();
    }
}