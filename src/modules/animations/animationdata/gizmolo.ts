import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const gizmoloAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 40,
            texture: "./data/textures/gizmolo003.png",
            nextFrame: 1
        },
        {
            ticks: 2,
            texture: "./data/textures/gizmolo004.png",
            nextFrame: 2
        },
        {
            ticks: 40,
            texture: "./data/textures/gizmolo001.png",
            nextFrame: 3
        },
        {
            ticks: 2,
            texture: "./data/textures/gizmolo002.png",
            nextFrame: 0
        }
    ],
    [SequenceTypes.WALK]: [
        {
            ticks: 10,
            texture: "./data/textures/gizmolo005.png",
            nextFrame: 1
        },
        {
            ticks: 10,
            texture: "./data/textures/gizmolo006.png",
            nextFrame: 2
        },
        {
            ticks: 10,
            texture: "./data/textures/gizmolo007.png",
            nextFrame: 3
        },
        {
            ticks: 10,
            texture: "./data/textures/gizmolo008.png",
            nextFrame: 0
        }
    ],
    [SequenceTypes.ATTACK]: [
        {
            ticks: 10,
            texture: "./data/textures/gizmolo009.png",
            nextFrame: 1
        },
        {
            ticks: 10,
            texture: "./data/textures/gizmolo010.png",
            nextFrame: 1
        }
    ],
    [SequenceTypes.ACTION_HOLD]: [
        {
            ticks: 50,
            texture: "./data/textures/gizmolo009.png",
            nextFrame: 0
        },
    ],
}