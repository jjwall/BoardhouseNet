import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";
import { Vector3 } from "three";

/**
 * Movement system.
 * @param ents Ents from the control entitities registry.
 */
export function controlSystem(ents: ReadonlyArray<Entity>, worldEngine: BaseWorldEngine) {
    let movementDirection = new Vector3(0,0,0);
    ents.forEach(ent => {
        let updatePlayerEnt = false;
        if (ent.control && ent.pos && ent.vel) {
            // Handle animations.
            switch (ent.player.class) {
                case PlayerClassTypes.MAGICIAN:
                    if (ent.control.studderTicks > 0) {
                        ent.anim.sequence = SequenceTypes.ATTACK;
                    }
                    else if (ent.control.up || ent.control.down || ent.control.left || ent.control.right)
                        ent.anim.sequence = SequenceTypes.WALK;
                    else
                        ent.anim.sequence = SequenceTypes.IDLE;
                    break;
            }

            // Process studder.
            if (ent.control.studderTicks > 0) {
                ent.control.studderTicks--;
            }
            else {
                // Left
                if (ent.control.left) {
                    // ent.pos.loc.x -= 25;
                    // ent.pos.dir.setX(-1);
                    // ent.pos.dir.setY(0);
                    movementDirection.setX(-1);
                    movementDirection.setY(0);
                    ent.vel.positional.add(movementDirection.multiplyScalar(ent.vel.acceleration));
                    ent.pos.flipX = true;

                    // updatePlayerEnt = true;
                }

                // Right
                if (ent.control.right) {
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
                if (ent.control.up) {
                    // ent.pos.loc.y += 25;
                    movementDirection.setX(0);
                    movementDirection.setY(1);
                    ent.vel.positional.add(movementDirection.multiplyScalar(ent.vel.acceleration));

                    // updatePlayerEnt = true;
                }

                // Down 
                if (ent.control.down) {
                    // ent.pos.loc.y -= 25;
                    movementDirection.setX(0);
                    movementDirection.setY(-1);
                    ent.vel.positional.add(movementDirection.multiplyScalar(ent.vel.acceleration));

                    // updatePlayerEnt = true;
                }

                // Reduce attack cooldown by one tick.
                if (ent.control.attackCooldownTicks > 0) {
                    ent.control.attackCooldownTicks--;
                }
            }

            // Check to see if we need to push changed ent data to change list.
            // Note: will need to do something akin to this after all systems are run so we don't have
            // multiple update items to the same ent in the change list for one tick of the engine.
            // if (updatePlayerEnt) {
            //     state.server.entityChangeList.push(ent);
            // }
        }
    });
}