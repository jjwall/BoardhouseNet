import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const fishAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 15,
            texture: "./data/textures/fish001.png",
            nextFrame: 1
        },
        {
            ticks: 15,
            texture: "./data/textures/fish002.png",
            nextFrame: 0
        },
    ]
}