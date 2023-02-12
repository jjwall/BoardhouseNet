import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const fishAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 15,
            texture: "./data/textures/npcs/fish/fish001.png",
            nextFrame: 1
        },
        {
            ticks: 15,
            texture: "./data/textures/npcs/fish/fish002.png",
            nextFrame: 0
        },
    ]
}