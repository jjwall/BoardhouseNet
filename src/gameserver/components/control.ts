/**
 * Control component.
 */
 export interface ControlComponent {
    jump: boolean;
    attack: boolean;
    attackCooldownTicks: number;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

/**
 * Helper for initializing ControlComponent with starting values.
 */
export function setControls(): ControlComponent {
    return {
        jump: false,
        attack: false,
        attackCooldownTicks: 0,
        left: false,
        right: false,
        up: false,
        down: false,
    };
}