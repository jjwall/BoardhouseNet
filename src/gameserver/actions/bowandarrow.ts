import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage, broadcastUpdateEntitiesMessage } from "../messaging/sendnetentitymessages";
import { bowAndArrowAnim } from "../../modules/animations/animationdata/bowandarrow";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { getWorldPosition, setPosition } from "../components/position";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { HitboxTypes, setHitbox } from "../components/hitbox";
import { setVelocity } from "../components/velocity";
import { Entity } from "../serverengine/entity";
import { setTimer } from "../components/timer";
import { Vector3 } from "three";

export function bowAndArrowPress(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    if (attackingEnt.movement) {
        attackingEnt.movement.actionOverride = bowAndArrowHold;
    }
}

export function bowAndArrowHold(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    const offsetPosX = 100;
    const offsetPosY = 100;

    if (attackingEnt.anim) {
        attackingEnt.anim.sequence = SequenceTypes.ACTION_HOLD;
    }

    if (!attackingEnt.actionReticle) {
        let { unitCircleCoordinateX, unitCircleCoordinateY } = getUnitCircleCoordsFromInputs(attackingEnt);
        if (unitCircleCoordinateX === 0 && unitCircleCoordinateY === 0) {
            if (attackingEnt.pos.flipX) {
                unitCircleCoordinateX = -1;
                unitCircleCoordinateY = 0;
            }
            else {
                unitCircleCoordinateX = 1;
                unitCircleCoordinateY = 0;
            }
        }
        let bow = new Entity();
        const bowDirection = new Vector3(unitCircleCoordinateX, unitCircleCoordinateY);
        bow.pos = setPosition(offsetPosX * unitCircleCoordinateX, offsetPosY * unitCircleCoordinateY, 5, bowDirection);
        bow.sprite = { url: "./data/textures/bow_and_arrow001.png", pixelRatio: 8 };
        bow.anim = { sequence: SequenceTypes.IDLE, blob: bowAndArrowAnim };

        // Set parent Since we're setting position relative to attacking ent.
        bow.parent = attackingEnt;

        // Set action reticle reference.
        attackingEnt.actionReticle = bow;

        worldEngine.registerEntity(bow, worldEngine.server);
        broadcastCreateEntitiesMessage([bow], worldEngine.server, worldEngine.worldType);
    }
    else {
        if (attackingEnt.movement) {
            const { unitCircleCoordinateX, unitCircleCoordinateY } = getUnitCircleCoordsFromInputs(attackingEnt);
            const bowWorldPos = getWorldPosition(attackingEnt.actionReticle);
            let angle = Math.atan2(bowWorldPos.y - attackingEnt.pos.loc.y, bowWorldPos.x - attackingEnt.pos.loc.x);

            // Change attacking char's direction when angle crosses above or below vertical axis.
            if (Math.abs(angle) > Math.PI / 2 || Math.abs(angle) > -Math.PI / 2) {
                attackingEnt.pos.flipX = true;
            }

            if (Math.abs(angle) < Math.PI / 2 || Math.abs(angle) < -Math.PI / 2) {
                attackingEnt.pos.flipX = false;
            }

            if (unitCircleCoordinateX === 0 && unitCircleCoordinateY === 0) {
                // keep current pos and dir
            }
            else { // update
                attackingEnt.actionReticle.pos.loc = new Vector3(offsetPosX * unitCircleCoordinateX, offsetPosY * unitCircleCoordinateY);
                attackingEnt.actionReticle.pos.dir = new Vector3(unitCircleCoordinateX, unitCircleCoordinateY);
            }

            // Update attacking ent. -> bug when anims stop -> just need to reset to idle?
            worldEngine.server.entityChangeList.push(attackingEnt);
            worldEngine.server.entityChangeList.push(attackingEnt?.actionReticle);
        }
    }
}

export function bowAndArrowRelease(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    if (attackingEnt?.actionReticle) {
        // Get angle of reticle to player char.
        const bowWorldPos = getWorldPosition(attackingEnt.actionReticle);
        const angle = Math.atan2(bowWorldPos.y - attackingEnt.pos.loc.y, bowWorldPos.x - attackingEnt.pos.loc.x);
        const arrowDirection = new Vector3(Math.cos(angle), Math.sin(angle), 5);

        // Create arrow and launch in direction of desired angle.
        let arrow = new Entity();
        arrow.pos = setPosition(attackingEnt.pos.loc.x, attackingEnt.pos.loc.y, 5, arrowDirection);
        arrow.sprite = { url: "./data/textures/arrow.png", pixelRatio: 4 };
        arrow.vel = setVelocity(30, 0);
        arrow.vel.positional.add(arrowDirection.multiplyScalar(arrow.vel.acceleration));
        arrow.hitbox = setHitbox(HitboxTypes.PLAYER_PROJECTILE, [HitboxTypes.TILE_OBSTACLE, HitboxTypes.ENEMY, HitboxTypes.HOSTILE_PLAYER], 25, 25);
        arrow.hitbox.onHit = (arrow, other, manifold) => {
            if (other.hitbox.collideType === HitboxTypes.TILE_OBSTACLE
                || other.hitbox.collideType === HitboxTypes.ENEMY) {
                // arrow.vel.acceleration = 0;
                // arrow.vel.friction = 10;
                // arrow.hitbox = undefined // -> breaks
                broadcastDestroyEntitiesMessage([arrow], worldEngine.server, worldEngine);
            }
        }
        arrow.timer = setTimer(100, () => {
            broadcastDestroyEntitiesMessage([arrow], worldEngine.server, worldEngine);
        });

        // Register arrow ent and broadcast creation event.
        worldEngine.registerEntity(arrow, worldEngine.server);
        broadcastCreateEntitiesMessage([arrow], worldEngine.server, worldEngine.worldType);

        // Destroy bow and free up reference.
        attackingEnt.actionReticle.anim.sequence = SequenceTypes.ATTACK;

        // Set timer to destroy bow in X amount of ticks to allow attack anim to play.

        attackingEnt.actionReticle.timer = setTimer(10, () => {
            broadcastDestroyEntitiesMessage([attackingEnt.actionReticle], worldEngine.server, worldEngine);
            attackingEnt.actionReticle.parent = undefined;
            attackingEnt.actionReticle = undefined;
        })

        broadcastUpdateEntitiesMessage([attackingEnt.actionReticle, attackingEnt], worldEngine.server, worldEngine.worldType);
    }

    // Set character animation back to idle once arrow has been shot.
    if (attackingEnt.anim) {
        attackingEnt.anim.sequence = SequenceTypes.IDLE;
    }

    // Free up reference to action override so player can resume movement.
    if (attackingEnt?.movement?.actionOverride) {
        attackingEnt.movement.actionOverride = undefined;
    }
}

// helper method
function getUnitCircleCoordsFromInputs(attackingEnt: Entity) {
    let unitCircleCoordinateX = 0;
    let unitCircleCoordinateY = 0;

    if (attackingEnt.movement) {
        if (attackingEnt.movement.right && attackingEnt.movement.up) {
            unitCircleCoordinateX = Math.sqrt(2) / 2;
            unitCircleCoordinateY = Math.sqrt(2) / 2;
        }
        else if (attackingEnt.movement.right && attackingEnt.movement.down) {
            unitCircleCoordinateX = Math.sqrt(2) / 2;
            unitCircleCoordinateY = -Math.sqrt(2) / 2;
        }
        else if (attackingEnt.movement.left && attackingEnt.movement.down) {
            unitCircleCoordinateX = -Math.sqrt(2) / 2;
            unitCircleCoordinateY = -Math.sqrt(2) / 2;
        }
        else if (attackingEnt.movement.left && attackingEnt.movement.up) {
            unitCircleCoordinateX = -Math.sqrt(2) / 2;
            unitCircleCoordinateY = Math.sqrt(2) / 2;
        }
        else if (attackingEnt.movement.up) {
            unitCircleCoordinateX = 0;
            unitCircleCoordinateY = 1;
        }
        else if (attackingEnt.movement.right) {
            unitCircleCoordinateX = 1;
            unitCircleCoordinateY = 0;
        }
        else if (attackingEnt.movement.down) {
            unitCircleCoordinateX = 0;
            unitCircleCoordinateY = -1;
        }
        else if (attackingEnt.movement.left) {
            unitCircleCoordinateX = -1;
            unitCircleCoordinateY = 0;
        }
    }

    return { unitCircleCoordinateX, unitCircleCoordinateY }
}