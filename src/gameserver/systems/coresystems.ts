import { send } from "process";
import { BaseState } from "../server/basestate";
import { Entity } from "../states/gameplay/entity";
import { sendUpdateEntitiesMessage, sendPlayerAttackAnimDisplayMessage } from "./../messaging/sendmessages";

/**
 * Control system.
 * @param ents Ents from the control entitities registry.
 */
export function controlSystem(ents: ReadonlyArray<Entity>, state: BaseState){
    ents.forEach(ent => {
        let updatePlayerEnt = false;
        if (ent.control && ent.pos) {
            // Left
            if (ent.control.left) {
                ent.pos.x -= 25;

                updatePlayerEnt = true;
            }

            // Right
            if (ent.control.right) {
                ent.pos.x += 25;

                updatePlayerEnt = true;
            }

            // Up
            if (ent.control.up) {
                ent.pos.y += 25;

                updatePlayerEnt = true;
            }

            // Down 
            if (ent.control.down) {
                ent.pos.y -= 25;

                updatePlayerEnt = true;
            }

            // Reduce attack cooldown by one tick.
            if (ent.control.attackCooldownTicks > 0) {
                ent.control.attackCooldownTicks--;
            }

            // Attack
            if (ent.control.attack) {
                if (ent.control.attackCooldownTicks <= 0) {
                    // Send attack msg (test code for now)
                    let attackEnts: Entity[] = [];
                    let attackEnt: Entity = new Entity();
                    attackEnt.pos = { x: ent.pos.x + 100, y: ent.pos.y, z: ent.pos.z + 1};
                    attackEnt.sprite = { url: "./data/textures/mediumExplosion1.png", pixelRatio: 4 };
                    attackEnts.push(attackEnt);
                    sendPlayerAttackAnimDisplayMessage(attackEnts, state.server);
                  
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
            if (updatePlayerEnt) {
                state.server.entityChangeList.push(ent);
            }
        }
    });
}

export function playerSystem(ents: ReadonlyArray<Entity>, state: BaseState) {
    // ...
}