import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const kenneyPlayerAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 50,
            texture: "./data/textures/player_stand.png",
            nextFrame: 0
        }
    ],
    [SequenceTypes.WALK]: [
        {
            ticks: 10,
            texture: "./data/textures/player_walk1.png",
            nextFrame: 1
        },
        {
            ticks: 10,
            texture: "./data/textures/player_walk2.png",
            nextFrame: 0
        }
    ],
    [SequenceTypes.ATTACK]: [
        {
            ticks: 10,
            texture: "./data/textures/player_action1.png",
            nextFrame: 1
        },
        {
            ticks: 10,
            texture: "./data/textures/player_action2.png",
            nextFrame: 1
        }
    ],
    [SequenceTypes.ACTION_HOLD]: [
        {
            ticks: 50,
            texture: "./data/textures/player_action1.png",
            nextFrame: 0
        },
    ],
}