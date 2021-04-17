interface EntityData {
    netId: number;
    pos: {
        x: number;
        y: number;
        z: number;
    },
    sprite: {
        url: string;
        pixelRatio: number;
    },
    anim: {
        sequence: string;
    }
}