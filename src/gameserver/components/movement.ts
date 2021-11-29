/**
 * Movement component.
 */
 export interface MovementComponent {
    attackCooldownTicks: number;
    studderTicks: number;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

/**
 * Helper for initializing ControlComponent with starting values.
 */
export function setMovement(): MovementComponent {
    return {
        attackCooldownTicks: 0,
        studderTicks: 0,
        left: false,
        right: false,
        up: false,
        down: false,
    };
}