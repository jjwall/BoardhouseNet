import { getWorldPosition, setPosition } from "../components/position";
import { getRandomInt } from "../serverengine/helpers";
import { Behavior, BehaviorResult } from "../components/behavior";
import { Entity } from "../serverengine/entity";
import { Vector3 } from "three";
import { HitboxTypes, setHitbox } from "../components/hitbox";

interface GoblinState {
    // hp: number;
    // strength: number;
    movementAccel: number;
    // pushPlayerAccel: number;
    // pushEnemyAccel: number;
    // pushedMeleeAccel: number;
    // pushedRangedAccel: number;
    // stunlocked: boolean;
    // stunlockTicks: number;
    target: Entity | undefined;
    lastMoveTickMark: number;
}

function moveToTargetLocation(self: Entity, targetPos: Vector3) {
    const homeSpawnArea = self.parent;
    const selfWorldPos = getWorldPosition(self);
    const spawnAreaWorldPos = getWorldPosition(homeSpawnArea);
    const dist = selfWorldPos.distanceTo(spawnAreaWorldPos);

    if (dist > 50) {
        const directionTo = new Vector3(targetPos.x - selfWorldPos.x, targetPos.y - selfWorldPos.y).normalize();

        self.vel.positional.add(directionTo.multiplyScalar(6));
    }
    // else {
    //     // idle... anim
    // }
}

function createGoblinVision(goblinEnt: Entity, state: GoblinState): Entity {
    let goblinVision = new Entity();
    goblinVision.pos = setPosition (0, 0, 1);
    goblinVision.sprite = { url: "./data/textures/empty_texture.png", pixelRatio: 1 };
    goblinVision.parent = goblinEnt;
    goblinVision.hitbox = setHitbox(HitboxTypes.ENEMY_VISION, [HitboxTypes.PLAYER], 500, 500);//, 180);
    goblinVision.hitbox.onHit = (vision, other, manifold) => {
        // if (!state.stunlocked) {
            if (other.hitbox.collideType === HitboxTypes.PLAYER && !state.target) {
                state.target = other;
                // const playerWorldPos = getWorldPosition(other);
                // const selfWorldPos ...
                // const followDirection = new Vector3(playerWorldPos.x - selfWorldPos.x, playerWorldPos.y - selfWorldPos.y).normalize();
                // goblinEnt.vel.positional.add(followDirection.multiplyScalar(state.movementAccel));
                // if (other.pos.loc.x < goblinEnt.pos.loc.x) {
                //     goblinEnt.pos.flipX = true;
                // }
                // else if (other.pos.loc.x >= goblinEnt.pos.loc.x) {
                //     goblinEnt.pos.flipX = false;
                // }
            }
        // }
    }
    return goblinVision;
}

// Prob set all goblin hitboxes here so we can handle state locally.
export function* goblinBehavior(): Behavior {
    const { self, worldEngine } = yield;
    let state: GoblinState = {
        movementAccel: 12,
        target: undefined,
        lastMoveTickMark: 0
    }
    // let target: Entity = undefined;
    const goblinVision = createGoblinVision(self, state);
    worldEngine.registerEntity(goblinVision, worldEngine.server);
    // broadcastCreateEntitiesMessage([goblin, goblinVision], worldEngine.server, worldEngine.worldType);

    const homeSpawnArea = self.parent;
    const spawnAreaWorldPos = getWorldPosition(homeSpawnArea);
    let randomLocX = getRandomInt(spawnAreaWorldPos.x -homeSpawnArea.hitbox.width / 2, spawnAreaWorldPos.x + homeSpawnArea.hitbox.width / 2);
    let randomLocY = getRandomInt(spawnAreaWorldPos.y -homeSpawnArea.hitbox.width / 2, spawnAreaWorldPos.y + homeSpawnArea.hitbox.width / 2);
    let targetPos = new Vector3(randomLocX, randomLocY);

    let ticks = 0;

    while (!state.target) {
        yield
        ticks++;

        if (ticks - state.lastMoveTickMark > getRandomInt(50, 100)) {
            // const homeSpawnArea = self2.parent;
            // const spawnAreaWorldPos = getWorldPosition(homeSpawnArea);

            // Reset target location.
            const selfWorldPos = getWorldPosition(self);
            randomLocX = getRandomInt(spawnAreaWorldPos.x -homeSpawnArea.hitbox.width / 2, spawnAreaWorldPos.x + homeSpawnArea.hitbox.width / 2);
            randomLocY = getRandomInt(spawnAreaWorldPos.y -homeSpawnArea.hitbox.height / 2, spawnAreaWorldPos.y + homeSpawnArea.hitbox.height / 2);
            targetPos = new Vector3(randomLocX, randomLocY);
            const directionTo = new Vector3(targetPos.x - selfWorldPos.x, targetPos.y - selfWorldPos.y).normalize();
            if (directionTo.x > 0) {
                self.pos.flipX = false;
            } else {
                self.pos.flipX = true;
            }
            
            state.lastMoveTickMark = ticks;

            // moveToTargetLocation(self, targetVec);
        }
        moveToTargetLocation(self, targetPos);
    }

    goblinVision.parent = undefined
    // destroy vision

    return BehaviorResult.SUCCESS;
}