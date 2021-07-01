import { Mesh, PlaneGeometry, EdgesGeometry, LineSegments, LineBasicMaterial } from "three";
import { Client } from "../client/client";

/**
 * Helper to set visuals for a hitBox.
 * Used for testing hit collision assumptions.
 * @param entMesh Could be optional. Not every hitBox will have an associated ent mesh.
 * However, would need a way to remove it if added directly to scene.
 * @param hitbox
 * @param color color of hitBox graphic. Defaults to red if no parameter is passed in.
 */
 export function setHitboxGraphic(client: Client, entMesh: Mesh, hitbox: EntityDataHitbox, color: string = "#DC143C") : void {
    if (client.displayHitBoxes) {
        const hitBoxPlaneGeometry = new PlaneGeometry(hitbox.width, hitbox.height);
        const hitBoxEdgesGeometry = new EdgesGeometry(hitBoxPlaneGeometry);
        const hitBoxMaterial = new LineBasicMaterial({ color: color });
        const hitBoxWireframe = new LineSegments(hitBoxEdgesGeometry, hitBoxMaterial);
        hitBoxWireframe.position.x += hitbox.offsetX;
        hitBoxWireframe.position.y += hitbox.offsetY;
        // TODO // Don't rotate hitbox graphic with the parent object, actual hitbox does not rotate.
        // -> need to add gyroscope from three.js for this
        entMesh.add(hitBoxWireframe);
    }
}

type EntityDataHitbox = {
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
}