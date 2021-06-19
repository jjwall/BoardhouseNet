import { Mesh, Scene, NearestFilter, PlaneGeometry, MeshBasicMaterial, Vector3 } from "three";
import { Client } from "../client/client";

export type SpriteComponent = Mesh;

/**
 * Helper method to initialize sprite component for an entity. Also adds sprite to scene.
 * @param url Path to texture file.
 * @param scene THREE.Scene.
 * @param client
 * @param pixelRatio Number of pixels to scale texture's height and width by.
 */
export function setSprite(url: string, scene: Scene, client: Client, pixelRatio?: number) : SpriteComponent {
    if (!pixelRatio) {
        pixelRatio = 1;
    }
    
    const spriteMap = client.getTexture(url);
    const geometry = new PlaneGeometry(spriteMap.image.width*pixelRatio, spriteMap.image.height*pixelRatio);
    spriteMap.magFilter = NearestFilter; // Set magFilter to nearest for crisp looking pixels.
    const material = new MeshBasicMaterial( { map: spriteMap, transparent: true });
    const sprite = new Mesh(geometry, material);
    scene.add(sprite);

    return sprite;
}