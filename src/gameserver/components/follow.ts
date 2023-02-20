import { broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
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

export function setFollow(entToFollow: Entity, followerNetId: number, offsetX: number): FollowComponent {
    entToFollow.followerNetId = followerNetId
    return { entToFollow: entToFollow, offsetX: offsetX, positionsToFollow: []}
}

export function removeFollower(followedEnt: Entity, worldEngine: BaseWorldEngine) {
    if (followedEnt.followerNetId) {
        const followingEnt = worldEngine.server.netIdToEntityMap[followedEnt.followerNetId]
        broadcastDestroyEntitiesMessage([followingEnt], worldEngine.server, worldEngine)
        followingEnt.followerNetId = undefined
    }
}