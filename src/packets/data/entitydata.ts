import { AnimationSchema } from "../../modules/animations/animationschema";
import { SequenceTypes } from "../../modules/animations/sequencetypes";

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
        color?: string;
    },
    sprite?: {
        url: string;
        pixelRatio: number;
    },
    anim?: {
        sequence: SequenceTypes;
        blob: AnimationSchema;
    }
    player?: {
        id: string;
    }
}