import { Vector3 } from "three";

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
    flipX: boolean;
}

/**
 * Helper for initializing an entity's position.
 * @param xPos 
 * @param yPos 
 * @param zPos 
 * @param startingDirection optional param. If not specified, direction will be: Vector3(1, 0, 0).
 */
export function setPosition(xPos: number, yPos: number, zPos: number, startingDirection?: Vector3, flipX?: boolean, wrap?: boolean): PositionComponent {
    let position: PositionComponent = { loc: new Vector3(xPos, yPos, zPos), dir: null, flipX: false, wrap: false };

    if (startingDirection) 
        position.dir = startingDirection;
    else
        position.dir = new Vector3(1, 0, 0);

    if (flipX)
        position.flipX = flipX;
      
    if (wrap)
        position.wrap = wrap;

    return position;
}