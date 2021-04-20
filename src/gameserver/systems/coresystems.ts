import { send } from "process";
import { BaseState } from "../server/basestate";
import { Entity } from "../states/gameplay/entity";
import { sendUpdateEntityMessage } from "./../messaging/sendmessages";

/**
 * Control system.
 * @param ents Ents from the control entitities registry.
 */
export function controlSystem(ents: ReadonlyArray<Entity>, state: BaseState){
    ents.forEach(ent => {
        if (ent.control && ent.pos) {
            // Left
            if (ent.control.left) {
                ent.pos.x--;

                // Won't want to actually update here - at end of engine tick.
                sendUpdateEntityMessage(ent, state.server);
            }

            // Right
            if (ent.control.right) {
                ent.pos.x++;

                // Won't want to actually update here - at end of engine tick.
                sendUpdateEntityMessage(ent, state.server);
            }
        }
    });
}
