import { createGoblinSpearVision, setGoblinSpearHitbox } from "../archetypes/goblinspear";
import { broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { Behavior, BehaviorResult, setBehavior } from "../components/behavior";
import { getWorldPosition, setPosition } from "../components/position";
import { HitboxTypes, setHitbox } from "../components/hitbox";
import { getRandomInt } from "../serverengine/helpers";
import { Entity } from "../serverengine/entity";
import { Vector3 } from "three";

/** @deprecated - To Do: Add to stats component. */
export interface GoblinSpearState {
    /** @deprecated */
    hp: number;
    // strength: number;
    movementAccel: number;
    pushPlayerAccel: number;
    pushEnemyAccel: number;
    pushedMeleeAccel: number;
    pushedRangedAccel: number;
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

// Prob set all goblin hitboxes here so we can handle state locally.
export function* goblinSpearBehavior(): Behavior {
    const { self, worldEngine } = yield;
    let state: GoblinSpearState = {
        hp: 10, // randomize max hp 10 - 15?
        target: undefined,
        lastMoveTickMark: 0,
        movementAccel: 12, // randomize movement 10 - 15?
        pushPlayerAccel: 20,
        pushEnemyAccel: 25,
        pushedMeleeAccel: 20,
        pushedRangedAccel: 85,
    }
    setGoblinSpearHitbox(self, state, worldEngine);
    const goblinVision = createGoblinSpearVision(self, state);
    worldEngine.registerEntity(goblinVision, worldEngine.server);
    // broadcastCreateEntitiesMessage([goblin, goblinVision], worldEngine.server, worldEngine.worldType);

    const homeSpawnArea = self.parent;
    const spawnAreaWorldPos = getWorldPosition(homeSpawnArea);

    // Pick random point within spawn area bounds to move to.
    let randomLocX = getRandomInt(spawnAreaWorldPos.x -homeSpawnArea.hitbox.width / 2, spawnAreaWorldPos.x + homeSpawnArea.hitbox.width / 2);
    let randomLocY = getRandomInt(spawnAreaWorldPos.y -homeSpawnArea.hitbox.width / 2, spawnAreaWorldPos.y + homeSpawnArea.hitbox.width / 2);
    let targetPos = new Vector3(randomLocX, randomLocY);

    let ticks = 0;

    while (!state.target) {
        yield
        ticks++;

        if (ticks - state.lastMoveTickMark > getRandomInt(50, 100)) {
            // Reset target location.
            const selfWorldPos = getWorldPosition(self);
            randomLocX = getRandomInt(spawnAreaWorldPos.x -homeSpawnArea.hitbox.width / 2, spawnAreaWorldPos.x + homeSpawnArea.hitbox.width / 2);
            randomLocY = getRandomInt(spawnAreaWorldPos.y -homeSpawnArea.hitbox.height / 2, spawnAreaWorldPos.y + homeSpawnArea.hitbox.height / 2);
            targetPos = new Vector3(randomLocX, randomLocY);
            const directionTo = new Vector3(targetPos.x - selfWorldPos.x, targetPos.y - selfWorldPos.y).normalize();
            if (randomLocX > selfWorldPos.x) {
                self.pos.flipX = false;
            } else {
                self.pos.flipX = true;
            }
            
            state.lastMoveTickMark = ticks;

            // moveToTargetLocation(self, targetVec);
        }

        moveToTargetLocation(self, targetPos);
    }

    // Free up reference to goblin and destroy vision entity.
    goblinVision.parent = undefined
    broadcastDestroyEntitiesMessage([goblinVision], worldEngine.server, worldEngine);

    let selfWorldPos = getWorldPosition(self);
    let targetWorldPos = getWorldPosition(state.target);
    let distToTarget = selfWorldPos.distanceTo(targetWorldPos);
    let distToHome = selfWorldPos.distanceTo(spawnAreaWorldPos);

    while (distToHome < 750) { // distToTarget > 25 || // && !target.isDead && dist to home not too far
        yield
        selfWorldPos = getWorldPosition(self);
        targetWorldPos = getWorldPosition(state.target);
        distToTarget = selfWorldPos.distanceTo(targetWorldPos);
        distToHome = selfWorldPos.distanceTo(spawnAreaWorldPos);

        const followDirection = new Vector3(targetWorldPos.x - selfWorldPos.x, targetWorldPos.y - selfWorldPos.y).normalize();
        self.vel.positional.add(followDirection.multiplyScalar(state.movementAccel));

        if (targetWorldPos.x < selfWorldPos.x) {
            self.pos.flipX = true;
        }
        else if (targetWorldPos.x >= selfWorldPos.x) {
            self.pos.flipX = false;
        }
    }

    // Reset behavior.
    resetGoblinSpearState(state);
    self.behavior = setBehavior(goblinSpearBehavior);
    return BehaviorResult.SUCCESS;
}

function resetGoblinSpearState(state: GoblinSpearState) {
    state.hp = 10
    state.target = undefined
}