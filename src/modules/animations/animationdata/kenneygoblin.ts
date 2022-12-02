import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const kenneyGoblinAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 50,
            texture: "./data/textures/kenney_goblin001.png",
            nextFrame: 0
        },
    ],
    [SequenceTypes.WALK]: [
        {
            ticks: 10,
            texture: "./data/textures/kenney_goblin001.png",
            nextFrame: 1
        },
        {
            ticks: 10,
            texture: "./data/textures/kenney_goblin002.png",
            nextFrame: 2
        },
        {
            ticks: 10,
            texture: "./data/textures/kenney_goblin003.png",
            nextFrame: 3
        },
        {
            ticks: 10,
            texture: "./data/textures/kenney_goblin004.png",
            nextFrame: 0
        },
    ]
}