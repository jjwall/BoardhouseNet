export interface PlayerComponent {
    id: string;
}

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
 * Sprite component.
 */
export interface SpriteComponent {
    url: string,
    pixelRatio: number,
}

/**
 * Animation component.
 */
export interface AnimationComponent {
    sequence: string,
    currentFrame: number,
}