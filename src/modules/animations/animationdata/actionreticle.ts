import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const actionReticleAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 7,
            texture: "./data/textures/vfx/action_reticle001.png",
            nextFrame: 1
        },
        {
            ticks: 7,
            texture: "./data/textures/vfx/action_reticle002.png",
            nextFrame: 2
        },
        {
            ticks: 7,
            texture: "./data/textures/vfx/action_reticle003.png",
            nextFrame: 0
        },
    ]
}