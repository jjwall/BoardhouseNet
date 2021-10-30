import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const necroBasicAttackAnim: AnimationSchema = {
    [SequenceTypes.ATTACK]: [
        {
            ticks: 15,
            texture: "./data/textures/unholyblast1.png",
            nextFrame: 1
       },
        {
            ticks: 15,
            texture: "./data/textures/unholyblast2.png",
            nextFrame: 2
       },
       {
        ticks: 15,
        texture: "./data/textures/unholyblast3.png",
        nextFrame: 0
   },
    ]
}