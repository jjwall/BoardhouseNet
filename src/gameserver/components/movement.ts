import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";

/**
 * Movement component.
 */
 export interface MovementComponent {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    dodgeRolling: boolean;
    stutterTicks: number;
    actionOverride: ((entPerformingAction: Entity, worldEngine: BaseWorldEngine) => any) | undefined;
    /** @deprecated I think? */
    attackCooldownTicks: number;
}

/**
 * Helper for initializing ControlComponent with starting values.
 */
export function setMovement(): MovementComponent {
    return {
        left: false,
        right: false,
        up: false,
        down: false,
        dodgeRolling: false,
        stutterTicks: 0,
        actionOverride: undefined,
        attackCooldownTicks: 0,
    };
}