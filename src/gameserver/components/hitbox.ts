import { Mesh, Box3, PlaneGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, MeshBasicMaterial } from "three";
import { Entity } from "../states/gameplay/entity";
import { PositionComponent } from "./position";
import { Server } from "../server/server";

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
 * @param entMesh An entity's mesh A.K.A. sprite to be set before calling this function.
 * @param collideType This entity's HitBox type.
 * @param collidesWith List of HitBox types the HitBox can collide with.
 * @param heightOverride (Optional) Exact number of pixels to set for the hitBox's height.
 * Must also set ``widthOverride`` for this to take effect.
 * @param widthOverride (Optional) Exact number of pixels to set for the hitBox's width.
 * Must also set ``heightOverride`` for this to take effect.
 * @param offsetX (Default 0) Number of pixels to offset the hitbox's x position.
 * @param offsetY (Default 0) Number of pixels to offset the hitbox's y position.
 */
export function setHitbox(entMesh: Mesh, collideType: HitboxTypes, collidesWith: HitboxTypes[], heightOverride?: number, widthOverride?: number, offsetX: number = 0, offsetY: number = 0) : HitboxComponent {
    let hitbox: HitboxComponent = { collideType: collideType, collidesWith: collidesWith, height: 0, width: 0, offsetX: offsetX, offsetY: offsetY };

    if (heightOverride && widthOverride) {
        if (heightOverride <= 0 || widthOverride <= 0)
            throw Error("overrides can't be less than or equal to 0.");
        hitbox.height = heightOverride;
        hitbox.width = widthOverride;
    }
    else {
        const boundingBox = new Box3().setFromObject(entMesh);

        hitbox.height = boundingBox.max.y - boundingBox.min.y;
        hitbox.width =  boundingBox.max.x - boundingBox.min.x;
    }

    return hitbox;
}

/**
 * Helper to set visuals for a hitBox.
 * Used for testing hit collision assumptions.
 * @param entMesh Could be optional. Not every hitBox will have an associated ent mesh.
 * However, would need a way to remove it if added directly to scene.
 * @param hitbox
 * @param color color of hitBox graphic. Defaults to red if no parameter is passed in.
 */
// export function setHitboxGraphic(server: Server, entMesh: Mesh, hitbox: HitboxComponent, color: string = "#DC143C") : void {
//     if (server.displayHitBoxes) {
//         const hitBoxPlaneGeometry = new PlaneGeometry(hitbox.width, hitbox.height);
//         const hitBoxEdgesGeometry = new EdgesGeometry(hitBoxPlaneGeometry);
//         const hitBoxMaterial = new LineBasicMaterial({ color: color });
//         const hitBoxWireframe = new LineSegments(hitBoxEdgesGeometry, hitBoxMaterial);
//         hitBoxWireframe.position.x += hitbox.offsetX;
//         hitBoxWireframe.position.y += hitbox.offsetY;
//         // TODO // Don't rotate hitbox graphic with the parent object, actual hitbox does not rotate.
//         // -> need to add gyroscope from three.js for this
//         entMesh.add(hitBoxWireframe);
//     }
// }

export const getHitbox = (e: Entity): Rect => ({
    left: e.pos.loc.x + e.hitbox.offsetX - e.hitbox.width / 2,
    right: e.pos.loc.x + e.hitbox.offsetX + e.hitbox.width / 2,
    bottom: e.pos.loc.y + e.hitbox.offsetY - e.hitbox.height / 2,
    top: e.pos.loc.y + e.hitbox.offsetY + e.hitbox.height / 2,
});

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