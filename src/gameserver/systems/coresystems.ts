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
        if (ent.control && ent.pos) {
            // Left
            if (ent.control.left) {
                ent.pos.x -= 25;

                // Won't want to actually update here - at end of engine tick.
                // sendUpdateEntitiesMessage(ent, state.server);
                state.server.entityChangeList.push(ent);
            }

            // Right
            if (ent.control.right) {
                ent.pos.x += 25;

                // Won't want to actually update here - at end of engine tick.
                // sendUpdateEntitiesMessage(ent, state.server);
                state.server.entityChangeList.push(ent);
            }

            // Reduce attack cooldown by one tick.
            if (ent.control.attackCooldownTicks > 0) {
                ent.control.attackCooldownTicks--;
            }

            // Attack
            if (ent.control.attack) {
                if (ent.control.attackCooldownTicks <= 0) {
                    // Send attack msg.
                    let testEnts: Entity[] = [];
                    testEnts.push(ent);
                    sendPlayerAttackAnimDisplayMessage(testEnts, state.server);
                  
                    // Start cooldown.
                    ent.control.attackCooldownTicks = 60;
                    ent.control.attack = false;
                }
                else {
                    ent.control.attack = false;
                }
            }
        }
    });
}
