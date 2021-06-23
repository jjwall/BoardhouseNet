interface EntityData {
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
        teleport?: boolean;
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