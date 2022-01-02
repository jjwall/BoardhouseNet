import { Mesh, Box3, PlaneGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, MeshBasicMaterial } from "three";
import { Entity } from "../serverengine/entity";
import { PositionComponent } from "./position";
import { Server } from "../serverengine/server";
import { getWorldPosition } from "./position";

/**
 * HitBox Component that represents the area that when colliding with
 * any of the "collidesWith" enum entries, entity will "hit" them.
 */
export interface HitboxComponent {
    collideType: HitboxTypes;
    collidesWith: HitboxTypes[];
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
    onHit?: (self: Entity, other: Entity, manifold: Manifold) => void;
}

/**
 * Helper for initializing an entity's hit box component.
 * Note: ``onHit`` callback should be set independently.
 * @param collideType This entity's HitBox type.
 * @param collidesWith List of HitBox types the HitBox can collide with.
 * @param height Exact number of pixels to set for the hitBox's height.
 * @param width Exact number of pixels to set for the hitBox's width.
 * @param offsetX (Default 0) Number of pixels to offset the hitbox's x position.
 * @param offsetY (Default 0) Number of pixels to offset the hitbox's y position.
 */
export function setHitbox(collideType: HitboxTypes, collidesWith: HitboxTypes[], height: number, width: number, offsetX: number = 0, offsetY: number = 0) : HitboxComponent {
    let hitbox: HitboxComponent = { collideType: collideType, collidesWith: collidesWith, height: 0, width: 0, offsetX: offsetX, offsetY: offsetY };

    if (height <= 0 || width <= 0)
        throw Error("height and width can't be less than or equal to 0.");
        
    hitbox.height = height;
    hitbox.width = width;

    return hitbox;
}

export const getHitbox = (e: Entity): Rect => {
    const globalPos = getWorldPosition(e);

    return {
        left: globalPos.x + e.hitbox.offsetX - e.hitbox.width / 2,
        right: globalPos.x + e.hitbox.offsetX + e.hitbox.width / 2,
        bottom: globalPos.y + e.hitbox.offsetY - e.hitbox.height / 2,
        top: globalPos.y + e.hitbox.offsetY + e.hitbox.height / 2,
    }
};

export const getManifold = (a: Rect, b: Rect): Manifold => {
    const rect = {
        left: Math.max(a.left, b.left),
        right: Math.min(a.right, b.right),
        bottom: Math.max(a.bottom, b.bottom),
        top: Math.min(a.top, b.top),
    };

    return {
        ...rect,
        width: rect.right - rect.left,
        height: rect.top - rect.bottom,
    };
};

/**
 * Enum for all possible types of HitBoxes. Naming is arbitrary
 * as long as they are properly set in HitBox "collidesWith" property
 * and HitBox "type" property.
 */
export const enum HitboxTypes {
    PLAYER,
    ENEMY,
    TILE_OBSTACLE,
    RED_FLOOR_TILE_EXIT_ITEM_SHOP, // castle loading zone
    INN_DOOR, // item shop loading zone
    PLAYER_SWORD_ATTACK,
    FISH_MOUTH,
}

export type Rect = {
    left: number;
    right: number;
    bottom: number;
    top: number;
};

export type Manifold = Rect & {
    width: number;
    height: number;
};

// type Entity = {
//     pos: PositionComponent;
//     hitBox: HitBoxComponent;
// }