import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { kenneyGoblinAnim } from "../../modules/animations/animationdata/kenneygoblin";
import { getWorldPosition, PositionComponent, setPosition } from "../components/position"
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { HitboxTypes, setHitbox } from "../components/hitbox";
import { goblinBehavior } from "./../behaviors/goblin";
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

interface GoblinState {
    hp: number;
    // strength: number;
    movementAccel: number;
    pushPlayerAccel: number;
    pushEnemyAccel: number;
    pushedMeleeAccel: number;
    pushedRangedAccel: number;
    // stunlocked: boolean;
    // stunlockTicks: number;
    // target: Entity | undefined;
}

export function createGoblin(worldEngine: BaseWorldEngine, pos: PositionComponent): Entity {
    const state: GoblinState = {
        hp: 10, // randomize max hp 10 - 15?
        movementAccel: 12, // randomize movement 10 - 15?
        pushPlayerAccel: 20,
        pushEnemyAccel: 25,
        pushedMeleeAccel: 20,
        pushedRangedAccel: 85,
        // stunlocked: false,
        // stunlockTicks: 0,
        // target: undefined,
    };
    const collidesWith = [
        HitboxTypes.PLAYER_SWORD_ATTACK,
        HitboxTypes.PLAYER_FIREBALL,
        HitboxTypes.PLAYER_PROJECTILE,
        HitboxTypes.PLAYER,
        HitboxTypes.ENEMY
    ];
    let goblin = new Entity();
    goblin.pos = pos;
    goblin.vel = setVelocity(15, 0.5);
    goblin.sprite = { url: "./data/textures/kenney_goblin001.png", pixelRatio: 4 };
    goblin.anim = { sequence: SequenceTypes.WALK, blob: kenneyGoblinAnim };
    goblin.behavior = setBehavior(goblinBehavior);
    goblin.hitbox = setHitbox(HitboxTypes.ENEMY, collidesWith, 50, 50, 0, 0);
    goblin.hitbox.onHit = (goblin, other, manifold) => {
        const goblinWorldPos = getWorldPosition(goblin);
        if (other.hitbox.collideType === HitboxTypes.PLAYER_FIREBALL
            || other.hitbox.collideType === HitboxTypes.PLAYER_PROJECTILE) {
            // Reduce HP
            // Todo: Build stats component that tracks damage multiplayers for magic and physical attack.
            // Also will track defense. Should make a process damage module that takes all factors into account.
            state.hp--;

            // Push goblin in direction of collision with fireball.
            // const fireballWorldPos = getWorldPosition(other);
            // const goblinCenterPointX = goblin.pos.loc.x + goblin.hitbox.offsetX;
            // const goblinCenterPointY = goblin.pos.loc.y + goblin.hitbox.offsetY;
            // const fireballCenterPointX = fireballWorldPos.x + other.hitbox.offsetX;
            // const fireballCenterPointY = fireballWorldPos.y + other.hitbox.offsetY;
            // const pushDirection = new Vector3(goblinCenterPointX - fireballCenterPointX, goblinCenterPointY - fireballCenterPointY).normalize();
            const pushDirection = other.pos.dir.clone().normalize();
            goblin.vel.positional.add(pushDirection.multiplyScalar(state.pushedRangedAccel));
        }

        if (other.hitbox.collideType === HitboxTypes.PLAYER_SWORD_ATTACK) {
            // TODO: See above.
            state.hp -= 0.1;

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

        if (state.hp <= 0) {
            broadcastDestroyEntitiesMessage([goblin], worldEngine.server, worldEngine);
        }
    }

    // const goblinVision = createGoblinVision(goblin, state);

    worldEngine.registerEntity(goblin, worldEngine.server);


    // vvvv move this stuff to behavior vvvv
    // worldEngine.registerEntity(goblinVision, worldEngine.server);
    // broadcastCreateEntitiesMessage([goblin, goblinVision], worldEngine.server, worldEngine.worldType);

    broadcastCreateEntitiesMessage([goblin], worldEngine.server, worldEngine.worldType);

    return goblin;
}

/** @deprecated moved to behavior */
function createGoblinVision(goblinEnt: Entity, state: GoblinState): Entity {
    let goblinVision = new Entity();
    goblinVision.pos = setPosition(0, 0, 1);
    //goblinVision.sprite = { url: "./data/textures/empty_texture.png", pixelRatio: 1 };
    goblinVision.parent = goblinEnt;
    goblinVision.hitbox = setHitbox(HitboxTypes.ENEMY_VISION, [HitboxTypes.PLAYER], 500, 500);//, 180);
    goblinVision.hitbox.onHit = (vision, other, manifold) => {
        // if (!state.stunlocked) {
            // if (other.hitbox.collideType === HitboxTypes.PLAYER) {
            //     const followDirection = new Vector3(other.pos.loc.x - goblinEnt.pos.loc.x, other.pos.loc.y - goblinEnt.pos.loc.y).normalize();
            //     goblinEnt.vel.positional.add(followDirection.multiplyScalar(state.movementAccel));
            //     if (other.pos.loc.x < goblinEnt.pos.loc.x) {
            //         goblinEnt.pos.flipX = true;
            //     }
            //     else if (other.pos.loc.x >= goblinEnt.pos.loc.x) {
            //         goblinEnt.pos.flipX = false;
            //     }
            // }
        // }
    }
    return goblinVision;
}

function processStunLock(state: GoblinState) {
    // .. handle in behaviors
}

function moveToRandomPoint(goblinEnt: Entity) {
    const randomTickAmount = 5;
    goblinEnt.timer = setTimer(randomTickAmount, () => {
        // move... ?
        moveToRandomPoint(goblinEnt);
    });
}