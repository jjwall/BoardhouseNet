import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const knightAnim: AnimationSchema = {
    [SequenceTypes.IDLE]: [
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_00.png",
            nextFrame: 1
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_01.png",
            nextFrame: 2
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_02.png",
            nextFrame: 3
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_03.png",
            nextFrame: 4
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_04.png",
            nextFrame: 5
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_05.png",
            nextFrame: 6
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_06.png",
            nextFrame: 7
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_07.png",
            nextFrame: 8
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_08.png",
            nextFrame: 9
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_09.png",
            nextFrame: 10
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_10.png",
            nextFrame: 11
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_11.png",
            nextFrame: 12
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_12.png",
            nextFrame: 13
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_13.png",
            nextFrame: 14
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_14.png",
            nextFrame: 15
        },
        {
            ticks: 3,
            texture: "./assets/textures/knight/idle/Heroine_idle_15.png",
            nextFrame: 0
        },
    ],
    [SequenceTypes.WALK]: [
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_00.png",
            nextFrame: 1
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_01.png",
            nextFrame: 2
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_02.png",
            nextFrame: 3
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_03.png",
            nextFrame: 4
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_04.png",
            nextFrame: 5
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_05.png",
            nextFrame: 6
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_06.png",
            nextFrame: 7
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_07.png",
            nextFrame: 8
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_08.png",
            nextFrame: 9
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_09.png",
            nextFrame: 10
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_10.png",
            nextFrame: 11
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_11.png",
            nextFrame: 12
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_12.png",
            nextFrame: 13
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_13.png",
            nextFrame: 14
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_14.png",
            nextFrame: 15
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_15.png",
            nextFrame: 16
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_16.png",
            nextFrame: 17
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_17.png",
            nextFrame: 18
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_18.png",
            nextFrame: 19
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_19.png",
            nextFrame: 20
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_20.png",
            nextFrame: 21
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_21.png",
            nextFrame: 22
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_22.png",
            nextFrame: 23
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/walk/Heroine_ranger_run_23.png",
            nextFrame: 0
        },
    ],
    [SequenceTypes.DODGE_ROLL]: [
        {
            ticks: 2,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_00.png",
            nextFrame: 1
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_01.png",
            nextFrame: 2
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_02.png",
            nextFrame: 3
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_03.png",
            nextFrame: 4
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_04.png",
            nextFrame: 5
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_05.png",
            nextFrame: 6
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_06.png",
            nextFrame: 7
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_07.png",
            nextFrame: 8
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_08.png",
            nextFrame: 9
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_09.png",
            nextFrame: 10
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_10.png",
            nextFrame: 11
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_11.png",
            nextFrame: 12
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_12.png",
            nextFrame: 13
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_13.png",
            nextFrame: 14
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_14.png",
            nextFrame: 15
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_15.png",
            nextFrame: 16
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_16.png",
            nextFrame: 17
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_17.png",
            nextFrame: 18
        },
        {
            ticks: 3,
            texture: "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_18.png",
            nextFrame: 18
        },
    ],
    [SequenceTypes.ATTACK]: [
        {
            ticks: 2,
            texture: "./assets/textures/Armature_bow_action_09.png",
            nextFrame: 1
        },
        {
            ticks: 50,
            texture: "./assets/textures/Armature_bow_action_10.png",
            nextFrame: 1
        },
    ],
    [SequenceTypes.ACTION_HOLD]: [
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_00.png",
            nextFrame: 1
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_01.png",
            nextFrame: 2
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_02.png",
            nextFrame: 3
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_03.png",
            nextFrame: 4
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_04.png",
            nextFrame: 5
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_05.png",
            nextFrame: 6
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_06.png",
            nextFrame: 7
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_07.png",
            nextFrame: 8
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_08.png",
            nextFrame: 9
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_09.png",
            nextFrame: 10
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_10.png",
            nextFrame: 11
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_11.png",
            nextFrame: 12
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_12.png",
            nextFrame: 13
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_13.png",
            nextFrame: 14
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_14.png",
            nextFrame: 15
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_15.png",
            nextFrame: 16
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_16.png",
            nextFrame: 17
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_17.png",
            nextFrame: 18
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_18.png",
            nextFrame: 19
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_19.png",
            nextFrame: 20
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_20.png",
            nextFrame: 21
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_21.png",
            nextFrame: 22
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_22.png",
            nextFrame: 23
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_23.png",
            nextFrame: 24
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_24.png",
            nextFrame: 24
        },
    ],
    [SequenceTypes.ATTACK]: [
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_25.png",
            nextFrame: 0
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_26.png",
            nextFrame: 1
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_27.png",
            nextFrame: 2
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_28.png",
            nextFrame: 3
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_29.png",
            nextFrame: 4
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_30.png",
            nextFrame: 5
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_31.png",
            nextFrame: 6
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_32.png",
            nextFrame: 7
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_33.png",
            nextFrame: 8
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_34.png",
            nextFrame: 9
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_35.png",
            nextFrame: 10
        },
        {
            ticks: 2,
            texture: "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_36.png",
            nextFrame: 10
        },
    ]
}