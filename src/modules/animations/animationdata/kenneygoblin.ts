import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const kenneyGoblinAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 50,
            texture: "./assets/textures/npcs/kenney_goblin/kenney_goblin001.png",
            nextFrame: 0
        },
    ],
    [SequenceTypes.WALK]: [
        {
            ticks: 10,
            texture: "./assets/textures/npcs/kenney_goblin/kenney_goblin001.png",
            nextFrame: 1
        },
        {
            ticks: 10,
            texture: "./assets/textures/npcs/kenney_goblin/kenney_goblin002.png",
            nextFrame: 2
        },
        {
            ticks: 10,
            texture: "./assets/textures/npcs/kenney_goblin/kenney_goblin003.png",
            nextFrame: 3
        },
        {
            ticks: 10,
            texture: "./assets/textures/npcs/kenney_goblin/kenney_goblin004.png",
            nextFrame: 0
        },
    ]
}