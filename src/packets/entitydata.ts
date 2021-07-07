export interface EntityData {
    netId?: number;
    pos?: {
        loc: {
            x: number;
            y: number;
            z: number;
        },
        dir: {
            x: number;
            y: number;
            z: number;
        }
        flipX?: boolean;
        teleport?: boolean;
    },
    hitbox?: {
        height: number;
        width: number;
        offsetX: number;
        offsetY: number;
    },
    sprite?: {
        url: string;
        pixelRatio: number;
    },
    anim?: {
        sequence: string;
    }
    player?: {
        id: string;
    }
}