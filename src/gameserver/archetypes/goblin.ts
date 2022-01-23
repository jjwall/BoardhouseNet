import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { kenneyGoblinAnim } from "../../modules/animations/animationdata/kenneygoblin";
import { getWorldPosition, PositionComponent, setPosition } from "../components/position"
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { HitboxTypes, setHitbox } from "../components/hitbox";
import { setVelocity } from "../components/velocity";
import { Entity } from "../serverengine/entity";
import { setTimer } from "../components/timer";
import { Vector3 } from "three";

// goblin state to pass around (store target, hp, strength, pushPower etc. here)
// behaviors (random movements / follow target, change targets, idle, etc.)

export function createGoblin(worldEngine: BaseWorldEngine, pos: PositionComponent) {
    let goblin = new Entity();
    let hp = 10;
    goblin.pos = pos;
    goblin.vel = setVelocity(15, 0.5);
    goblin.sprite = { url: "./data/textures/kenney_goblin001.png", pixelRatio: 4 };
    goblin.anim = { sequence: SequenceTypes.WALK, blob: kenneyGoblinAnim };
    goblin.hitbox = setHitbox(HitboxTypes.ENEMY, [HitboxTypes.PLAYER_SWORD_ATTACK, HitboxTypes.PLAYER_FIREBALL, HitboxTypes.PLAYER], 50, 50, 0, 0);
    goblin.hitbox.onHit = (goblin, other, manifold) => {
        if (other.hitbox.collideType === HitboxTypes.PLAYER_FIREBALL) {
            // Reduce HP
            // Todo: Build stats component that tracks damage multiplayers for magic and physical attack.
            // Also will track defense. Should make a process damage module that takes all factors into account.
            hp--;

            // Push goblin in direction of collision with fireball.
            const pushAccel = 55;
            const fireballWorldPos = getWorldPosition(other);
            const goblinCenterPointX = goblin.pos.loc.x + goblin.hitbox.offsetX;
            const goblinCenterPointY = goblin.pos.loc.y + goblin.hitbox.offsetY;
            const fireballCenterPointX = fireballWorldPos.x + other.hitbox.offsetX;
            const fireballCenterPointY = fireballWorldPos.y + other.hitbox.offsetY;
            const pushDirection = new Vector3(goblinCenterPointX - fireballCenterPointX, goblinCenterPointY - fireballCenterPointY).normalize();
            goblin.vel.positional.add(pushDirection.multiplyScalar(pushAccel));
        }

        if (other.hitbox.collideType === HitboxTypes.PLAYER_SWORD_ATTACK) {
            // TODO: See above.
            hp -= 0.1;

            // Push goblin in opposite X direction of attacking player.
            const pushAccel = 20;
            const pushDirection = new Vector3(0, 0, 0);
            const attackingPlayerPosX = other.parent?.pos.loc.x;
            const goblinPosX = goblin.pos.loc.x;

            if (goblinPosX < attackingPlayerPosX) {
                pushDirection.setX(-1);
                pushDirection.setY(0);
                goblin.vel.positional.add(pushDirection.multiplyScalar(pushAccel));
            }
            else if (goblinPosX >= attackingPlayerPosX) {
                pushDirection.setX(1);
                pushDirection.setY(0);
                goblin.vel.positional.add(pushDirection.multiplyScalar(pushAccel));
            }
        }

        // Goblin comes in contact with player, push player and reduce HP.
        if (other.hitbox.collideType === HitboxTypes.PLAYER) {
            const pushAccel = 55;
            const playerWorldPos = getWorldPosition(other);
            const goblinCenterPointX = goblin.pos.loc.x// + goblin.hitbox.offsetX;
            const goblinCenterPointY = goblin.pos.loc.y// + goblin.hitbox.offsetY;
            const playerCenterPointX = playerWorldPos.x// + other.hitbox.offsetX;
            const playerCenterPointY = playerWorldPos.y + other.hitbox.offsetY;
            const pushDirection = new Vector3(playerCenterPointX - goblinCenterPointX, playerCenterPointY - goblinCenterPointY).normalize();
            other.vel.positional.add(pushDirection.multiplyScalar(pushAccel));
        }

        if (hp <= 0) {
            broadcastDestroyEntitiesMessage([goblin], worldEngine.server, worldEngine);
        }
    }

    const goblinVision = createGoblinVision(goblin);

    worldEngine.registerEntity(goblin, worldEngine.server);
    worldEngine.registerEntity(goblinVision, worldEngine.server);
    broadcastCreateEntitiesMessage([goblin, goblinVision], worldEngine.server, worldEngine.worldType);
}

function createGoblinVision(goblinEnt: Entity): Entity {
    const movementAccel = 12;
    let goblinVision = new Entity();
    goblinVision.pos = setPosition(0, 0, 1);
    goblinVision.sprite = { url: "./data/textures/empty_texture.png", pixelRatio: 1 };
    goblinVision.parent = goblinEnt;
    goblinVision.hitbox = setHitbox(HitboxTypes.ENEMY_VISION, [HitboxTypes.PLAYER], 500, 500);//, 180);
    goblinVision.hitbox.onHit = (vision, other, manifold) => { 
        if (other.hitbox.collideType === HitboxTypes.PLAYER) {
            const followDirection = new Vector3(other.pos.loc.x - goblinEnt.pos.loc.x, other.pos.loc.y - goblinEnt.pos.loc.y).normalize();
            goblinEnt.vel.positional.add(followDirection.multiplyScalar(movementAccel));
            if (other.pos.loc.x < goblinEnt.pos.loc.x) {
                goblinEnt.pos.flipX = true;
            }
            else if (other.pos.loc.x >= goblinEnt.pos.loc.x) {
                goblinEnt.pos.flipX = false;
            }
        }
    }
    return goblinVision;
}

function moveToRandomPoint(goblinEnt: Entity) {
    const randomTickAmount = 5;
    goblinEnt.timer = setTimer(randomTickAmount, () => {
        // move... ?
        moveToRandomPoint(goblinEnt);
    });
}