import { sendNetEventMessage } from "./../messaging/sendmessages";
import { NetEventTypes } from "../../packets/neteventtypes";
import { setPosition } from "../components/position";
import { Entity } from "../serverengine/entity";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Vector3 } from "three";

/**
 * Control system.
 * @param ents Ents from the control entitities registry.
 */
// TODO: (done) replace current pos updating with BoardhouseTS style updating
// i.e. have a PositionSystem / VelocitySystem that handles updates
// TODO: Refactor back end to separate out components
// TODO: (done) Handle dir for ents facing left or right based on their movement
// -> Make sure this updates other player ents on current player's client.
// TODO: Set up HitBox system & component.
export function controlSystem(ents: ReadonlyArray<Entity>, worldEngine: BaseWorldEngine) {
    let movementDirection = new Vector3(0,0,0);
    ents.forEach(ent => {
        let updatePlayerEnt = false;
        if (ent.control && ent.pos && ent.vel) {
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

            // Attack
            if (ent.control.attack) {
                if (ent.control.attackCooldownTicks <= 0) {
                    // Send attack msg (test code for now)
                    let attackPosOffset = 100;
                    if (ent.pos.flipX)
                        attackPosOffset -= 200;
                    let attackEnts: Entity[] = [];
                    let attackEnt: Entity = new Entity();
                    let atkDirection = new Vector3(.5,.5,0);
                    attackEnt.pos = setPosition(ent.pos.loc.x + attackPosOffset, ent.pos.loc.y, ent.pos.loc.z + 1, atkDirection);
                    attackEnt.sprite = { url: "./data/textures/mediumExplosion1.png", pixelRatio: 4 };
                    attackEnts.push(attackEnt);
                    sendNetEventMessage(attackEnts, worldEngine.server, NetEventTypes.PLAYER_ATTACK_ANIM_DISPLAY, worldEngine.worldType);
                  
                    // Start cooldown.
                    ent.control.attackCooldownTicks = 60;
                    ent.control.attack = false;
                }
                else {
                    ent.control.attack = false;
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