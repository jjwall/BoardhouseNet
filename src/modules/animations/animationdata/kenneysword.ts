import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const kenneySwordAnim: AnimationSchema = {
    [SequenceTypes.ATTACK]: [
        {
            ticks: 10,
            texture: "./data/textures/items/kenney_sword001.png",
            nextFrame: 1
        },
        {
            ticks: 3,
            texture: "./data/textures/items/kenney_sword002.png",
            nextFrame: 2
        },
        {
            ticks: 10,
            texture: "./data/textures/items/kenney_sword003.png",
            nextFrame: 2
        }
    ]
}