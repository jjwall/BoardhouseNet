import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const armatureAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_00.png",
            nextFrame: 1
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_01.png",
            nextFrame: 2
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_02.png",
            nextFrame: 3
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_03.png",
            nextFrame: 4
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_04.png",
            nextFrame: 5
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_05.png",
            nextFrame: 6
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_06.png",
            nextFrame: 7
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_07.png",
            nextFrame: 8
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_08.png",
            nextFrame: 9
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_09.png",
            nextFrame: 10
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_10.png",
            nextFrame: 11
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_11.png",
            nextFrame: 12
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_12.png",
            nextFrame: 13
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_13.png",
            nextFrame: 14
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_14.png",
            nextFrame: 15
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_15.png",
            nextFrame: 16
        },
        {
            ticks: 8,
            texture: "./data/textures/Armature_idle_16.png",
            nextFrame: 0
        },
    ],
    [SequenceTypes.WALK]: [
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_00.png",
            nextFrame: 1
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_01.png",
            nextFrame: 2
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_02.png",
            nextFrame: 3
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_03.png",
            nextFrame: 4
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_04.png",
            nextFrame: 5
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_05.png",
            nextFrame: 6
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_06.png",
            nextFrame: 7
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_07.png",
            nextFrame: 8
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_08.png",
            nextFrame: 9
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_09.png",
            nextFrame: 10
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_10.png",
            nextFrame: 11
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_11.png",
            nextFrame: 12
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_12.png",
            nextFrame: 13
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_13.png",
            nextFrame: 14
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_14.png",
            nextFrame: 15
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_15.png",
            nextFrame: 16
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_16.png",
            nextFrame: 17
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_17.png",
            nextFrame: 18
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_18.png",
            nextFrame: 19
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_19.png",
            nextFrame: 20
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_20.png",
            nextFrame: 21
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_21.png",
            nextFrame: 22
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_22.png",
            nextFrame: 23
        },
        {
            ticks: 4,
            texture: "./data/textures/Armature_walk_23.png",
            nextFrame: 24
        },
        {
            ticks: 1,
            texture: "./data/textures/Armature_walk_24.png",
            nextFrame: 0
        },
    ],
    [SequenceTypes.ATTACK]: [
        {
            ticks: 2,
            texture: "./data/textures/Armature_bow_action_09.png",
            nextFrame: 1
        },
        {
            ticks: 50,
            texture: "./data/textures/Armature_bow_action_10.png",
            nextFrame: 1
        },
    ],
    [SequenceTypes.ACTION_HOLD]: [
        {
            ticks: 6,
            texture: "./data/textures/Armature_bow_action_00.png",
            nextFrame: 1
        },
        {
            ticks: 6,
            texture: "./data/textures/Armature_bow_action_01.png",
            nextFrame: 2
        },
        {
            ticks: 6,
            texture: "./data/textures/Armature_bow_action_02.png",
            nextFrame: 3
        },
        {
            ticks: 6,
            texture: "./data/textures/Armature_bow_action_03.png",
            nextFrame: 4
        },
        {
            ticks: 6,
            texture: "./data/textures/Armature_bow_action_04.png",
            nextFrame: 5
        },
        {
            ticks: 6,
            texture: "./data/textures/Armature_bow_action_05.png",
            nextFrame: 6
        },
        {
            ticks: 6,
            texture: "./data/textures/Armature_bow_action_06.png",
            nextFrame: 7
        },
        {
            ticks: 6,
            texture: "./data/textures/Armature_bow_action_07.png",
            nextFrame: 8
        },
        {
            ticks: 50,
            texture: "./data/textures/Armature_bow_action_08.png",
            nextFrame: 8
        },
    ],
}