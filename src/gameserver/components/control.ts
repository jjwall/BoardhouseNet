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