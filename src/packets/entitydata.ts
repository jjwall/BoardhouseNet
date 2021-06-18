interface EntityData {
    netId: number;
    pos: {
        x: number;
        y: number;
        z: number;
        teleport?: boolean;
    },
    sprite: {
        url: string;
        pixelRatio: number;
    },
    anim: {
        sequence: string;
    }
    player: {
        id: string;
    }
}