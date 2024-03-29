import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const kenneyBowAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 50,
            texture: "./assets/textures/items/kenney_bow001.png",
            nextFrame: 0
        }
    ],
    [SequenceTypes.ATTACK]: [
        {
            ticks: 5,
            texture: "./assets/textures/items/kenney_bow002.png",
            nextFrame: 1
        },
        {
            ticks: 50,
            texture: "./assets/textures/items/kenney_bow001.png",
            nextFrame: 1
        }
    ]
}