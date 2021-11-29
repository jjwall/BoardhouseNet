import { BaseWorldEngine } from "../serverengine/baseworldengine"
import { Entity } from "../serverengine/entity"

export class SkillSlotsComponent {
    private skillSlotOne: Skill
    private skillSlotTwo: Skill
    setSkillOne(value: Skill) {
        this.skillSlotOne = value
    }
    getSkillOne() {
        return this.skillSlotOne
    }
    setSkillTwo(value: Skill) {
        this.skillSlotTwo = value
    }
    getSkillTwo() {
        return this.skillSlotTwo
    }
}

export interface Skill {
    // castTimeSetTicks: number
    // castTimeRemainingTicks: number
    stutterSetTicks: number
    cooldownSetTicks: number
    cooldownRemainingTicks: number
    triggerAction: boolean
    action(entDoingAction: Entity, worldEngine: BaseWorldEngine): void
}

export function initializeSkill(stutterSetTicks: number, cooldownTicks: number, action: (entDoingAction: Entity, worldEngine: BaseWorldEngine) => void): Skill {
    return {
        stutterSetTicks: stutterSetTicks,
        cooldownSetTicks: cooldownTicks,
        cooldownRemainingTicks: 0,
        triggerAction: false,
        action: action
    }
}