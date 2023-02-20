import { Entity } from "../serverengine/entity";

/**
 * Follow component.
 */
export interface FollowComponent {
    /** The entity to follow. */
    entToFollow: Entity
    /** List of { x, y } pos.loc coordinates to follow. */
    positionsToFollow: Array<{x: number, y: number}>
    /** How far away should this ent be following. */
    offsetX: number
}

export function setFollow(entToFollow: Entity, offsetX: number ): FollowComponent {
    return { entToFollow: entToFollow, offsetX: offsetX, positionsToFollow: []}
}