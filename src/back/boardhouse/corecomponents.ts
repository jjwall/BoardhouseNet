/**
 * Control component.
 */
export interface ControlComponent {
    jump: boolean;
    attack: boolean;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

export interface PositionComponent {
    x: number,
    y: number
}

export interface SpriteComponent {
    url: string,
    pixelRatio: number,
}