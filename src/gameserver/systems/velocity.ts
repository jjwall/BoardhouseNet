import { Vector3 } from "three";
import { PositionComponent } from "../components/position";
import { VelocityComponent } from "../components/velocity";
import { BaseState } from "../server/basestate";
import { Entity } from "../states/gameplay/entity";

/**
 * Velocity System.
 * @param ents 
 */
export function velocitySystem(ents: ReadonlyArray<Entity>, state: BaseState) : void {
    ents.forEach(ent => { 
        if (ent.vel && ent.pos) {
            if (ent.vel.friction) {
                ent.vel.positional.multiplyScalar(ent.vel.friction);
            }

            const currentPos = new Vector3(ent.pos.loc.x, ent.pos.loc.y, 0);
            ent.pos.loc.add(ent.vel.positional);
            const newPos = new Vector3(ent.pos.loc.x, ent.pos.loc.y, 0);
            ent.pos.dir.applyEuler(ent.vel.rotational); // TODO: Need to have entityChange check for rotations.

            if (newPos !== currentPos)
                state.server.entityChangeList.push(ent);
        }
    });
}

// type Entity = {
//     pos: PositionComponent;
//     vel: VelocityComponent;
// }