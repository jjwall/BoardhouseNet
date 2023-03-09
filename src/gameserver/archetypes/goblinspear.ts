import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { getWorldPosition, PositionComponent, setPosition } from "../components/position";
import { goblinSpearAnim } from "../../modules/animations/animationdata/goblinspear";
import { goblinSpearBehavior, GoblinSpearState } from "./../behaviors/goblinspear";
import { presetGoblinSpearStats } from "../../database/stats/preset_goblinspearstats";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { HitboxTypes, setHitbox } from "../components/hitbox";
import { setVelocity } from "../components/velocity";
import { setBehavior } from "../components/behavior";
import { Entity } from "../serverengine/entity";
import { setTimer } from "../components/timer";
import { Vector3 } from "three";

// goblin state to pass around (store target, hp, strength, pushPower etc. here)
// behaviors (random movements / follow target, change targets, idle, etc.)
// beheviors - check for max distance from target, return home if distance is exceeded.
// have individual homes or shared?
// (done) spawn areas keep track of enemies?
// -> could be generic, takes x number of createEnemy archetype methods, and uses a random bag to "spawn"
// a given assortment of enemies.

export function createGoblinSpear(worldEngine: BaseWorldEngine, pos: PositionComponent): Entity {
    let goblin = new Entity();
    goblin.pos = pos;
    goblin.vel = setVelocity(15, 0.5);
    goblin.sprite = { url: "./assets/textures/npcs/goblin_spear/run/Heroine_goblin_spear_run_00.png", pixelRatio: 1 };
    goblin.anim = { sequence: SequenceTypes.RUN, blob: goblinSpearAnim };
    goblin.stats = presetGoblinSpearStats
    goblin.behavior = setBehavior(goblinSpearBehavior);

    // const goblinVision = createGoblinVision(goblin, state);

    worldEngine.registerEntity(goblin, worldEngine.server);

    broadcastCreateEntitiesMessage([goblin], worldEngine.server, worldEngine.worldType);

    return goblin;
}

export function setGoblinSpearHitbox(goblin: Entity, state: GoblinSpearState, worldEngine: BaseWorldEngine) {
    // if (!goblin.hitbox)
    const collidesWith = [
        HitboxTypes.PLAYER_SWORD_ATTACK,
        HitboxTypes.PLAYER_FIREBALL,
        HitboxTypes.PLAYER_PROJECTILE,
        HitboxTypes.PLAYER,
        HitboxTypes.ENEMY
    ];
    goblin.hitbox = setHitbox(HitboxTypes.ENEMY, collidesWith, 50, 50, 0, 0);
    goblin.hitbox.onHit = (goblin, other, manifold) => {
        const goblinWorldPos = getWorldPosition(goblin);
        if (other.hitbox.collideType === HitboxTypes.PLAYER_FIREBALL
            || other.hitbox.collideType === HitboxTypes.PLAYER_PROJECTILE) {
            // Reduce HP
            // Todo: Build stats component that tracks damage multiplayers for magic and physical attack.
            // Also will track defense. Should make a process damage module that takes all factors into account.
            state.hp--;
            goblin.stats.currentHp -= 15;

            // Push goblin in direction of collision with fireball.
            const pushDirection = other.pos.dir.clone().normalize();
            goblin.vel.positional.add(pushDirection.multiplyScalar(state.pushedRangedAccel));
        }

        if (other.hitbox.collideType === HitboxTypes.PLAYER_SWORD_ATTACK) {
            // TODO: See above.
            state.hp -= 0.1;
            goblin.stats.currentHp -= 1;

            // Push goblin in opposite X direction of attacking player.
            const pushDirection = new Vector3(0, 0, 0);
            const attackingPlayerPosX = getWorldPosition(other.parent).x;// other.parent?.pos.loc.x;
            const goblinPosX = getWorldPosition(goblin).x;// .pos.loc.x;

            if (goblinPosX < attackingPlayerPosX) {
                pushDirection.setX(-1);
                pushDirection.setY(0);
                goblin.vel.positional.add(pushDirection.multiplyScalar(state.pushedMeleeAccel));
            }
            else if (goblinPosX >= attackingPlayerPosX) {
                pushDirection.setX(1);
                pushDirection.setY(0);
                goblin.vel.positional.add(pushDirection.multiplyScalar(state.pushedMeleeAccel));
            }
        }

        // Goblin comes in contact with player, push player and reduce HP.
        if (other.hitbox.collideType === HitboxTypes.PLAYER) {
            const playerWorldPos = getWorldPosition(other);
            const goblinCenterPointX = goblinWorldPos.x// + goblin.hitbox.offsetX;
            const goblinCenterPointY = goblinWorldPos.y// + goblin.hitbox.offsetY;
            const playerCenterPointX = playerWorldPos.x// + other.hitbox.offsetX;
            const playerCenterPointY = playerWorldPos.y + other.hitbox.offsetY;
            const pushDirection = new Vector3(playerCenterPointX - goblinCenterPointX, playerCenterPointY - goblinCenterPointY).normalize();
            other.vel.positional.add(pushDirection.multiplyScalar(state.pushPlayerAccel));
        }

        // Goblin bumps into another enemy... maybe specify goblin hitbox here?
        if (other.hitbox.collideType === HitboxTypes.ENEMY) {
            const otherGoblinWorldPos = getWorldPosition(other);
            const pushDirection = new Vector3(otherGoblinWorldPos.x - goblinWorldPos.x, otherGoblinWorldPos.y - goblinWorldPos.y).normalize();
            other.vel.positional.add(pushDirection.multiplyScalar(state.pushEnemyAccel));
        }

        if (goblin.stats.currentHp <= 0) {
            // TODO: Death animation.
            broadcastDestroyEntitiesMessage([goblin], worldEngine.server, worldEngine);
        }
    }
}

// TODO: Figure out how to delete the vision...
export function createGoblinSpearVision(goblinEnt: Entity, state: GoblinSpearState): Entity {
    let goblinVision = new Entity();
    goblinVision.pos = setPosition (0, 0, 1);
    goblinVision.sprite = { url: "./assets/textures/misc/empty_texture.png", pixelRatio: 1 };
    goblinVision.parent = goblinEnt;
    goblinVision.hitbox = setHitbox(HitboxTypes.ENEMY_VISION, [HitboxTypes.PLAYER], 100, 100);//, 180);
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

function processStunLock(state: GoblinSpearState) {
    // .. handle in behaviors
}

function moveToRandomPoint(goblinEnt: Entity) {
    const randomTickAmount = 5;
    goblinEnt.timer = setTimer(randomTickAmount, () => {
        // move... ?
        moveToRandomPoint(goblinEnt);
    });
}