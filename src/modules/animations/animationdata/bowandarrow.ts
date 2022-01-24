import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const bowAndArrowAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 50,
            texture: "./data/textures/bow_and_arrow001.png",
            nextFrame: 0
        }
    ],
    [SequenceTypes.ATTACK]: [
        {
            ticks: 5,
            texture: "./data/textures/bow_and_arrow002.png",
            nextFrame: 1
        },
        {
            ticks: 50,
            texture: "./data/textures/bow_and_arrow001.png",
            nextFrame: 1
        }
    ]
}