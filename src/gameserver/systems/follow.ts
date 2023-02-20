import { Vector3 } from "three";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";

/**
 * Follow system.
 * @param ents List of ents to run system with. Following ents must have follow and pos components.
 */
export function followSystem(ents: ReadonlyArray<Entity>, worldEngine: BaseWorldEngine) {
    ents.forEach(ent => {
        if (ent.pos && ent.follow && ent.follow.entToFollow.pos && ent.follow.entToFollow.vel && ent.follow.entToFollow.movement) {
            ent.follow.positionsToFollow.push({x: ent.follow.entToFollow.pos.loc.x, y: ent.follow.entToFollow.pos.loc.y})

            if (ent.follow.positionsToFollow.length > 0) {
                const playerMovement = ent.follow.entToFollow.movement
                const playerMovementDiagonal = playerMovement.up && playerMovement.right || playerMovement.up && playerMovement.left || playerMovement.down && playerMovement.right || playerMovement.down && playerMovement.left
                const accelMultiplier = playerMovementDiagonal ? 1.425 : 1
                const followPos = ent.follow.positionsToFollow.shift();
                const offsetFlip = ent.follow.entToFollow.pos.flipX ? 1 : -1
                const distance = Math.abs((followPos.x - (ent.pos.loc.x - (ent.follow.offsetX * offsetFlip)))^2 - (followPos.y - ent.pos.loc.y)^2)
                if (distance > ent.follow.offsetX/4 || playerMovementDiagonal) {
                    const movementDirection = new Vector3(followPos.x - (ent.pos.loc.x - (ent.follow.offsetX * offsetFlip)), followPos.y - ent.pos.loc.y, 0).normalize()                
                    ent.vel.positional.add(movementDirection.multiplyScalar(ent.follow.entToFollow.vel.acceleration * accelMultiplier));
                    worldEngine.server.entityChangeList.push(ent);
                }
            }
        }
    })
}