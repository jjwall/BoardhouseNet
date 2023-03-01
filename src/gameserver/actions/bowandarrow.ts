import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { kenneyBowAnim } from "../../modules/animations/animationdata/kenneybow";
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

// Note: Bow sometimes lerps from far away, I believe this is due to the resetting of
// the bow's position. I think a position update should work better.
export function bowAndArrowHold(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    const offsetPosX = 100;
    const offsetPosY = 100;

    if (attackingEnt.anim) {
        attackingEnt.anim.sequence = SequenceTypes.ACTION_HOLD;
    }

    // If reference to bow doesn't exist, then create it.
    if (!attackingEnt.actionReticle) {
        // TODO: Should have lastDirection field on movement component and can set starting direction from it.
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
        bow.sprite = { url: "./assets/textures/items/kenney_bow001.png", pixelRatio: 1 };
        bow.anim = { sequence: SequenceTypes.IDLE, blob: kenneyBowAnim };

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

            worldEngine.server.entityChangeList.push(attackingEnt);
            worldEngine.server.entityChangeList.push(attackingEnt?.actionReticle);
        }
    }
}

export function bowAndArrowRelease(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    if (attackingEnt?.actionReticle && attackingEnt?.actionReticle?.parent) {
        // Get angle of bow to player char.
        const bowWorldPos = getWorldPosition(attackingEnt.actionReticle);
        const angle = Math.atan2(bowWorldPos.y - attackingEnt.pos.loc.y, bowWorldPos.x - attackingEnt.pos.loc.x);
        const arrowDirection = new Vector3(Math.cos(angle), Math.sin(angle), 5);

        // Create arrow and launch in direction of desired angle.
        let arrow = new Entity();
        arrow.pos = setPosition(attackingEnt.pos.loc.x, attackingEnt.pos.loc.y, 5, arrowDirection);
        arrow.sprite = { url: "./assets/textures/items/kenney_arrow.png", pixelRatio: 0.5 };
        arrow.vel = setVelocity(30, 0);
        arrow.vel.positional.add(arrowDirection.multiplyScalar(arrow.vel.acceleration));
        arrow.hitbox = setHitbox(HitboxTypes.PLAYER_PROJECTILE, [HitboxTypes.TILE_OBSTACLE, HitboxTypes.ENEMY, HitboxTypes.HOSTILE_PLAYER], 25, 25);

        // TODO: Arrow "sticks" to wall or enemy on contact, but hitbox doesn't hurt overtime.
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

        // Setting parent undefined here will make sure we don't pass the above check
        // so we can play the "post entity destroy" animation for bow.
        attackingEnt.actionReticle.parent = undefined;
        attackingEnt.actionReticle.timer = setTimer(10, () => {
            broadcastDestroyEntitiesMessage([attackingEnt.actionReticle], worldEngine.server, worldEngine);
            attackingEnt.actionReticle = undefined;
        })

        // Update bow position & animation.
        attackingEnt.actionReticle.anim.sequence = SequenceTypes.ATTACK;
        worldEngine.server.entityChangeList.push(attackingEnt.actionReticle);
    }

    // Set character animation back to idle once arrow has been shot.
    if (attackingEnt.anim) {
        attackingEnt.anim.sequence = SequenceTypes.IDLE;
    }

    // Free up reference to action override so player can resume movement.
    if (attackingEnt?.movement?.actionOverride) {
        attackingEnt.movement.actionOverride = undefined;
    }

    // Update attacking ent.
    worldEngine.server.entityChangeList.push(attackingEnt);
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