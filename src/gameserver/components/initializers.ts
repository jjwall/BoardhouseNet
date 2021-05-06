import { ControlComponent } from "./corecomponents";

/**
 * Helper for initializing ControlComponent with starting values.
 * at creation of the object.
 */
export function initializeControls(): ControlComponent {
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