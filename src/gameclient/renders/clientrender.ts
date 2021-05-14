import { Mesh, Scene, NearestFilter, PlaneGeometry, MeshBasicMaterial, Vector3 } from "three";
import { Client } from "../client/client";
// like ents...
export class ClientRender {
    constructor(ticks: number) {
        this.ticks = ticks; // TODO - get delta time for render ticks as some monitors will render faster than others. Renders should be based on time not render ticks...
    }

    public pos: PositionComponent;
    public sprite: SpriteComponent;
    public ticks: number;
}

// ***
// WILL STEAL ALL COMPONENTS BELOW FROM COMPONENTS DIR WHEN CLIENT REFACTOR IS DONE (REFACTOR)
// ***

/**
 * Position component.
 */
 export interface PositionComponent {
    /** Location vector. */
    loc: Vector3;
    /** Direction vector. */
    dir: Vector3;
    /** Wraparound behavior. */
    wrap: boolean;
    /** Flag that is checked in the lerping system to know if lerping should occur. */
    teleport?: boolean;
}

/**
 * Helper for initializing an entity's position.
 * @param xPos 
 * @param yPos 
 * @param zPos 
 * @param startingDirection optional param. If not specified, direction will be: Vector3(1, 0, 0).
 */
export function setPosition(xPos: number, yPos: number, zPos: number, startingDirection?: Vector3, wrap?: boolean): PositionComponent {
    let position: PositionComponent = { loc: new Vector3(xPos, yPos, zPos), dir: null, wrap: false };

    if (startingDirection) {
        position.dir = startingDirection;
    }
    else {
        position.dir = new Vector3(1, 0, 0);
    }
      
    if (wrap !== undefined) {
        position.wrap = wrap;
    }

    return position;
}

export type SpriteComponent = Mesh;

/**
 * Helper method to initialize sprite component for an entity. Also adds sprite to stage.
 * @param url Path to texture file.
 * @param scene THREE.Scene.
 * @param pixelRatio Number of pixels to scale texture's height and width by.
 */
export function setSprite(url: string, scene: Scene, client: Client, pixelRatio?: number) : SpriteComponent {
    if (!pixelRatio) {
        pixelRatio = 1;
    }
    
    // get texture from cached resources
    let spriteMap = client.getTexture(url);
    // load geometry (consider caching these as well)
    var geometry = new PlaneGeometry(spriteMap.image.width*pixelRatio, spriteMap.image.height*pixelRatio);
    // set magFilter to nearest for crisp looking pixels
    spriteMap.magFilter = NearestFilter;
    var material = new MeshBasicMaterial( { map: spriteMap, transparent: true });
    var sprite = new Mesh(geometry, material);
    scene.add(sprite);

    return sprite;
}