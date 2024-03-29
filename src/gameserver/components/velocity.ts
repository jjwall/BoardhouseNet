import { Vector3, Euler } from "three";

/**
 * Velocity component.
 */
export interface VelocityComponent {
    acceleration: number;
    positional: Vector3;
    rotational: Euler;
    friction?: number;
}

/**
 * Helper to intialize velocity component for any entity.
 * @param acceleration 
 * @param positionalVel 
 * @param rotationalVel 
 * @param friction 
 */
export function setVelocity(acceleration: number, friction?: number, positionalVel?: Vector3, rotationalVel?: Euler): VelocityComponent {
    let velocity: VelocityComponent = { 
        acceleration: acceleration,
        positional: null,
        rotational: null,
        friction: undefined
    };

    if (friction)
        velocity.friction = friction;

    if (positionalVel)
        velocity.positional = positionalVel;
    else
        velocity.positional = new Vector3();

    if (rotationalVel)
        velocity.rotational = rotationalVel;
    else
        velocity.rotational = new Euler();

    return velocity;
}