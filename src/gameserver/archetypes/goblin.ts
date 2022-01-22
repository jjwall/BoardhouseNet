import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { kenneyGoblinAnim } from "../../modules/animations/animationdata/kenneygoblin";
import { getWorldPosition, PositionComponent } from "../components/position"
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { HitboxTypes, setHitbox } from "../components/hitbox";
import { setVelocity } from "../components/velocity";
import { Entity } from "../serverengine/entity";
import { setTimer } from "../components/timer";
import { Vector3 } from "three";


export function createGoblin(worldEngine: BaseWorldEngine, pos: PositionComponent) {
    let goblin = new Entity();
    let hp = 10;
    goblin.pos = pos;
    goblin.pos.flipX = true;
    goblin.vel = setVelocity(15, 0.5);
    goblin.sprite = { url: "./data/textures/kenney_goblin001.png", pixelRatio: 4 };
    goblin.anim = { sequence: SequenceTypes.WALK, blob: kenneyGoblinAnim };
    goblin.hitbox = setHitbox(HitboxTypes.ENEMY, [HitboxTypes.PLAYER_SWORD_ATTACK, HitboxTypes.PLAYER_FIREBALL], 50, 50, 0, 0);
    goblin.hitbox.onHit = (goblin, other, manifold) => {
        if (other.hitbox.collideType === HitboxTypes.PLAYER_FIREBALL) {
            // Reduce HP
            // Todo: Build stats component that tracks damage multiplayers for magic and physical attack.
            // Also will track defense. Should make a process damage module that takes all factors into account.
            hp--;

            // Push goblin in direction of collision with fireball.
            const pushAccel = 45;
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
            const pushAccel = 10;
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

        if (hp <= 0) {
            broadcastDestroyEntitiesMessage([goblin], worldEngine.server, worldEngine);
        }
    }

    worldEngine.registerEntity(goblin, worldEngine.server);
    broadcastCreateEntitiesMessage([goblin], worldEngine.server, worldEngine.worldType);

    // hitbox
    
    // (done) hurtbox

    // detection entity hit box

    // entity push (hit)box

    // Random walk space "home" (hit)box
}

function moveToRandomPoint(goblinEnt: Entity) {
    const randomTickAmount = 5;
    goblinEnt.timer = setTimer(randomTickAmount, () => {
        // move... ?
        moveToRandomPoint(goblinEnt);
    });
}