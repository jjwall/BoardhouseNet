import { PositionComponent, setPosition } from "../components/position";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { getRandomInt } from "../serverengine/helpers";
import { Entity } from "../serverengine/entity";

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
    enemies: Entity[];
}

// TODO: Track and respawn ents over time.
// -> use a behavior for this?
export function createEntitySpawnArea(params: SpawnAreaParams) {
    const state: SpawnAreaState = {
        enemies: []
    };

    const { 
        pos,
        areaHeight,
        areaWidth,
        maxNumberOfEntities,
        createEntityArchetypes,
        worldEngine
    } = params;

    if (createEntityArchetypes.length > 0 && state.enemies.length < maxNumberOfEntities) {
        for (let i = 0; i < maxNumberOfEntities; i++) {

            // Select a random entity archetype to instantiate.
            const archetypeIndex = getRandomInt(0, createEntityArchetypes.length);
            const createEntity = createEntityArchetypes[archetypeIndex];

            // Randomize position location (within bounds of spawn area)
            const entityPositionX = getRandomInt(pos.loc.x - areaWidth / 2, pos.loc.x + areaWidth / 2);
            const entityPositionY = getRandomInt(pos.loc.y - areaHeight / 2, pos.loc.y + areaHeight / 2);
            const zIndex = 4;
            const entityPos = setPosition(entityPositionX, entityPositionY, zIndex);

            // Randomize facing direction.
            entityPos.flipX = Math.random() < 0.5;

            state.enemies.push(createEntity(worldEngine, entityPos));
        }
    }
}