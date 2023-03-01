import { PositionComponent, setPosition } from "../components/position";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { getRandomInt } from "../serverengine/helpers";
import { Entity } from "../serverengine/entity";
import { HitboxTypes, setHitbox } from "../components/hitbox";

export interface SpawnAreaParams {
    pos: PositionComponent,
    areaHeight: number,
    areaWidth: number,
    maxNumberOfEntities: number,
    // respawnTicks: number,
    /** Can have multiple types of createEntity methods passed in. */
    createEntityArchetypes: ((worldEngine: BaseWorldEngine, pos: PositionComponent) => Entity)[]
    worldEngine: BaseWorldEngine
}

interface SpawnAreaState {
    entities: Entity[];
}

// TODO: Track and respawn ents over time.
// -> use a behavior for this?
export function createEntitySpawnArea(params: SpawnAreaParams) {
    const spawnArea = new Entity();
    spawnArea.pos = params.pos;
    spawnArea.sprite = { url: "./assets/textures/misc/empty_texture.png", pixelRatio: 1 };
    spawnArea.hitbox = setHitbox(HitboxTypes.SPAWN_AREA, [], params.areaHeight, params.areaWidth); //... areaHeight areaWidth (for viewing spawn area)
    params.worldEngine.registerEntity(spawnArea, params.worldEngine.server);

    const state: SpawnAreaState = {
        entities: []
    };

    const { 
        pos,
        areaHeight,
        areaWidth,
        maxNumberOfEntities,
        createEntityArchetypes,
        worldEngine
    } = params;

    if (createEntityArchetypes.length > 0 && state.entities.length < maxNumberOfEntities) {
        for (let i = 0; i < maxNumberOfEntities; i++) {

            // Select a random entity archetype to instantiate.
            const archetypeIndex = getRandomInt(0, createEntityArchetypes.length);
            const createEntity = createEntityArchetypes[archetypeIndex];

            // Randomize position location (within bounds of spawn area)
            const entityPositionX = getRandomInt(-areaWidth / 2, areaWidth / 2);
            const entityPositionY = getRandomInt(-areaHeight / 2, areaHeight / 2);
            const zIndex = 4;
            const entityPos = setPosition(entityPositionX, entityPositionY, zIndex);

            // Randomize facing direction.
            entityPos.flipX = Math.random() < 0.5;

            // Create entity and set spawnArea as parent.
            const entity = createEntity(worldEngine, entityPos);
            entity.parent = spawnArea;
            state.entities.push(entity);
        }
    }
}