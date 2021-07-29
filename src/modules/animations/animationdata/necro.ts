import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const necroAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 0,
            texture: "./data/textures/necrowalk1.png",
            nextFrame: 0
       },
    ],
    [SequenceTypes.WALK]: [
        {
            ticks: 15,
            texture: "./data/textures/necrowalk1.png",
            nextFrame: 1
       },
        {
            ticks: 15,
            texture: "./data/textures/necrowalk2.png",
            nextFrame: 2
       },
        {
            ticks: 15,
            texture: "./data/textures/necrowalk3.png",
            nextFrame: 0
       }
    ],
    [SequenceTypes.ATTACK]: [
        {
            ticks: 15,
            texture: "./data/textures/necroattack1.png",
            nextFrame: 1
       },
        {
            ticks: 15,
            texture: "./data/textures/necroattack2.png",
            nextFrame: 0
       }
    ]
}