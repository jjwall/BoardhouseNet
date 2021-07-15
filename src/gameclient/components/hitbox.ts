import { Mesh, PlaneGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, Group } from "three";
import { Client } from "../clientengine/client";

/**
 * Helper to set visuals for a hitBox.
 * Used for testing hit collision assumptions.
 * @param entMesh Could be optional. Not every hitBox will have an associated ent mesh.
 * However, would need a way to remove it if added directly to scene.
 * @param hitbox
 * @param color color of hitBox graphic. Defaults to red if no parameter is passed in.
 */
 export function setHitboxGraphic(client: Client, entMesh: Mesh, hitbox: HitboxData, color: string = "#DC143C") : void {
    if (client.displayHitBoxes) {
        const hitboxPlaneGeometry = new PlaneGeometry(hitbox.width, hitbox.height);
        const hitboxEdgesGeometry = new EdgesGeometry(hitboxPlaneGeometry);
        const hitboxMaterial = new LineBasicMaterial({ color: color });
        const hitboxWireframe = new LineSegments(hitboxEdgesGeometry, hitboxMaterial);
        hitboxWireframe.position.x += hitbox.offsetX;
        hitboxWireframe.position.y += hitbox.offsetY;
        hitboxWireframe.position.z += 1;
        const container = new Group();
        entMesh.add(container);
        container.add(hitboxWireframe);
    }
}

type HitboxData = {
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
}