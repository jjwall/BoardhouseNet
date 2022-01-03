import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const zelfinAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 40,
            texture: "./data/textures/zelfin003.png",
            nextFrame: 1
        },
        {
            ticks: 2,
            texture: "./data/textures/zelfin004.png",
            nextFrame: 2
        },
        {
            ticks: 40,
            texture: "./data/textures/zelfin001.png",
            nextFrame: 3
        },
        {
            ticks: 2,
            texture: "./data/textures/zelfin002.png",
            nextFrame: 0
        }
    ],
    [SequenceTypes.WALK]: [
        {
            ticks: 10,
            texture: "./data/textures/zelfin005.png",
            nextFrame: 1
        },
        {
            ticks: 10,
            texture: "./data/textures/zelfin006.png",
            nextFrame: 0
        }
    ],
    [SequenceTypes.ATTACK]: [
        {
            ticks: 10,
            texture: "./data/textures/zelfin007.png",
            nextFrame: 1
        },
        {
            ticks: 10,
            texture: "./data/textures/zelfin008.png",
            nextFrame: 1
        }
    ]
}