import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const swordAnim: AnimationSchema = {
    [SequenceTypes.ATTACK]: [
        {
            ticks: 10,
            texture: "./assets/textures/items/basic_sword_attack001.png",
            nextFrame: 1
        },
        {
            ticks: 3,
            texture: "./assets/textures/items/basic_sword_attack002.png",
            nextFrame: 2
        },
        {
            ticks: 3,
            texture: "./assets/textures/items/basic_sword_attack003.png",
            nextFrame: 3
        },
        {
            ticks: 10,
            texture: "./assets/textures/items/basic_sword_attack004.png",
            nextFrame: 3
        }
    ]
}