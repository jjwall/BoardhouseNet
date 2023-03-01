import { BaseWorldEngine } from "../serverengine/baseworldengine"
import { Entity } from "../serverengine/entity"

export class SkillSlotsComponent {
    private skillSlotOne: Skill
    private skillSlotTwo: Skill
    setSkillOne = (value: Skill) => {
        this.skillSlotOne = value
    }
    getSkillOne = () => {
        return this.skillSlotOne
    }
    setSkillTwo = (value: Skill) => {
        this.skillSlotTwo = value
    }
    getSkillTwo = () => {
        return this.skillSlotTwo
    }
}

export interface Skill {
    // castTimeSetTicks: number
    // castTimeRemainingTicks: number
    stutterSetTicks: number
    cooldownSetTicks: number
    cooldownRemainingTicks: number
    /** 
     * @True Cooldown for skill will start once press action is performed 
     * @False Cooldown for skill will start once release action is performed
    */
    cooldownBeginsOnPress: boolean
    triggerPressAction: boolean
    triggerReleaseAction: boolean
    /** Tracks if press action was able to be performed so cooldown can begin after release (only used if cooldownBeginsOnPress = false) */
    pressActionPerformed: boolean
    pressAction?(entDoingAction: Entity, worldEngine: BaseWorldEngine): void
    releaseAction?(entDoingAction: Entity, worldEngine: BaseWorldEngine): void
}

export function initializeSkill(
    stutterSetTicks: number, 
    cooldownTicks: number, 
    pressAction: undefined | ((entDoingAction: Entity, worldEngine: BaseWorldEngine) => void),
    releaseAction: undefined | ((entDoingAction: Entity, worldEngine: BaseWorldEngine) => void),
    cooldownBeginsOnPress = true
    ): Skill {
    return {
        stutterSetTicks: stutterSetTicks,
        cooldownSetTicks: cooldownTicks,
        cooldownRemainingTicks: 0,
        cooldownBeginsOnPress: cooldownBeginsOnPress,
        triggerPressAction: false,
        triggerReleaseAction: false,
        pressActionPerformed: false,
        pressAction: pressAction,
        releaseAction: releaseAction
    }
}