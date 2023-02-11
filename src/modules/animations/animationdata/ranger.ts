import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const rangerAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_00.png",
            nextFrame: 1
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_01.png",
            nextFrame: 2
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_02.png",
            nextFrame: 3
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_03.png",
            nextFrame: 4
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_04.png",
            nextFrame: 5
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_05.png",
            nextFrame: 6
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_06.png",
            nextFrame: 7
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_07.png",
            nextFrame: 8
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_08.png",
            nextFrame: 9
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_09.png",
            nextFrame: 10
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_10.png",
            nextFrame: 11
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_11.png",
            nextFrame: 12
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_12.png",
            nextFrame: 13
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_13.png",
            nextFrame: 14
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_14.png",
            nextFrame: 15
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/idle/Heroine_ranger_idle_15.png",
            nextFrame: 0
        },
    ],
    [SequenceTypes.WALK]: [
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_00.png",
            nextFrame: 1
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_01.png",
            nextFrame: 2
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_02.png",
            nextFrame: 3
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_03.png",
            nextFrame: 4
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_04.png",
            nextFrame: 5
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_05.png",
            nextFrame: 6
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_06.png",
            nextFrame: 7
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_07.png",
            nextFrame: 8
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_08.png",
            nextFrame: 9
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_09.png",
            nextFrame: 10
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_10.png",
            nextFrame: 11
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_11.png",
            nextFrame: 12
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_12.png",
            nextFrame: 13
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_13.png",
            nextFrame: 14
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_14.png",
            nextFrame: 15
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_15.png",
            nextFrame: 16
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_16.png",
            nextFrame: 17
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_17.png",
            nextFrame: 18
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_18.png",
            nextFrame: 19
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_19.png",
            nextFrame: 20
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_20.png",
            nextFrame: 21
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_21.png",
            nextFrame: 22
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_22.png",
            nextFrame: 23
        },
        {
            ticks: 3,
            texture: "./data/textures/ranger/walk/Heroine_ranger_run_23.png",
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