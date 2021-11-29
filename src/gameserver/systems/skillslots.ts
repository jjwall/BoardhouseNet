import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";
import { Skill } from "../components/skillslots";

export function skillSlotsSystem(ents: readonly Entity[], worldEngine: BaseWorldEngine) {
    ents.forEach(ent => {
        if (ent.skillSlots) {
            const skillOne = ent.skillSlots.getSkillOne()
            const skillTwo = ent.skillSlots.getSkillTwo()
            reduceRemainingTicks(skillOne)
            reduceRemainingTicks(skillTwo)
            checkAndTriggerAction(skillOne, ent, worldEngine)
            checkAndTriggerAction(skillTwo, ent, worldEngine)
        }
    })   
}

function checkAndTriggerAction(skill: Skill, entDoingAction: Entity, worldEngine: BaseWorldEngine) {
    if (skill?.triggerAction) {
        if (skill.cooldownRemainingTicks <= 0) {
            // Action tied to skill is triggered.
            skill.action(entDoingAction, worldEngine)
            skill.triggerAction = false

            // Start skill cooldown.
            skill.cooldownRemainingTicks = skill.cooldownSetTicks

            // Set stutter ticks.
            if (entDoingAction.movement) {
                entDoingAction.movement.stutterTicks = skill.stutterSetTicks
            }
        }
        else {
            skill.triggerAction = false
        }
    }
}

function reduceRemainingTicks(skill: Skill) {
    if (skill) {
        // if (skill.castTimeRemainingTicks > 0) {
        //     skill.castTimeRemainingTicks--
        // }

        if (skill.cooldownRemainingTicks > 0) {
            skill.cooldownRemainingTicks--
        }
    }
}