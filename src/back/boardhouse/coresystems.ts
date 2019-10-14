import { Entity } from "./entity";

/**
 * Control system.
 * @param ents Ents from the control entitities registry.
 */
export function controlSystem(ents: ReadonlyArray<Entity>){
    ents.forEach(ent => {
        if (ent.control && ent.pos) {
            // Left
            if (ent.control.left) {
                ent.pos.x--;
            }

            // Right
            if (ent.control.right) {
                ent.pos.x++;
            }
        }
    });
}
