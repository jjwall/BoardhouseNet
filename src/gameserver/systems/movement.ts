import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";
import { Vector3 } from "three";

/**
 * Movement system.
 * @param ents Ents from the control entitities registry.
 */
export function movementSystem(ents: ReadonlyArray<Entity>, worldEngine: BaseWorldEngine) {
    let movementDirection = new Vector3(0,0,0);
    ents.forEach(ent => {
        if (ent.movement && ent.pos && ent.vel) {
            if (ent.movement.actionOverride) {
                ent.movement.actionOverride(ent, worldEngine);
            }
            else {
                processMovementInputs(ent, movementDirection);
            }
        }
    });
}

// TODO: Overhaul movement processing...
function processMovementInputs(ent: Readonly<Entity>, movementDirection: Vector3) {
    // Set animation sequences.
    if (ent.movement.stutterTicks > 0) {
        if (ent.movement.dodgeRolling)
            ent.anim.sequence = SequenceTypes.DODGE_ROLL
        else
            ent.anim.sequence = SequenceTypes.ATTACK
    } else if (ent.movement.up || ent.movement.down || ent.movement.left || ent.movement.right)
        ent.anim.sequence = SequenceTypes.WALK;
    else
        ent.anim.sequence = SequenceTypes.IDLE;

    // Process stutter.
    if (ent.movement.stutterTicks > 0) {
        ent.movement.stutterTicks--;

        if (ent.movement.dodgeRolling) {
            if (ent.movement.stutterTicks === 0)
                ent.movement.dodgeRolling = false

            if (ent.pos.flipX) {
                movementDirection.setX(-1);
                movementDirection.setY(0);
                ent.vel.positional.add(movementDirection.multiplyScalar(ent.vel.acceleration * 1.5));
            } else {
                movementDirection.setX(1);
                movementDirection.setY(0);
                ent.vel.positional.add(movementDirection.multiplyScalar(ent.vel.acceleration * 1.5));
            }
        }
    }
    else {
        // Left
        if (ent.movement.left) {
            // ent.pos.loc.x -= 25;
            // ent.pos.dir.setX(-1);
            // ent.pos.dir.setY(0);
            movementDirection.setX(-1);
            movementDirection.setY(0);
            ent.vel.positional.add(movementDirection.multiplyScalar(ent.vel.acceleration));
            ent.pos.flipX = true;
            ent.status.level += 1;
            ent.status.currentHp -= 5;

            // updatePlayerEnt = true;
        }

        // Right
        if (ent.movement.right) {
            // ent.pos.loc.x += 25;
            // ent.pos.dir.setX(1);
            // ent.pos.dir.setY(0);
            movementDirection.setX(1);
            movementDirection.setY(0);
            ent.vel.positional.add(movementDirection.multiplyScalar(ent.vel.acceleration));
            ent.pos.flipX = false;

            // updatePlayerEnt = true;
        }

        // Up
        if (ent.movement.up) {
            // ent.pos.loc.y += 25;
            movementDirection.setX(0);
            movementDirection.setY(1);
            ent.vel.positional.add(movementDirection.multiplyScalar(ent.vel.acceleration));

            // updatePlayerEnt = true;
        }

        // Down 
        if (ent.movement.down) {
            // ent.pos.loc.y -= 25;
            movementDirection.setX(0);
            movementDirection.setY(-1);
            ent.vel.positional.add(movementDirection.multiplyScalar(ent.vel.acceleration));

            // updatePlayerEnt = true;
        }

        // Reduce attack cooldown by one tick.
        if (ent.movement.attackCooldownTicks > 0) {
            ent.movement.attackCooldownTicks--;
        }
    }

// Check to see if we need to push changed ent data to change list.
// Note: will need to do something akin to this after all systems are run so we don't have
// multiple update items to the same ent in the change list for one tick of the engine.
// if (updatePlayerEnt) {
//     state.server.entityChangeList.push(ent);
// }
}