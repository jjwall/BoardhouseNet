import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";
import { Skill } from "../components/skills";

export function skillsSystem(ents: readonly Entity[], worldEngine: BaseWorldEngine) {
    ents.forEach(ent => {
        if (ent.skills) {
            const skillOne = ent.skills.getSkillOne()
            const skillTwo = ent.skills.getSkillTwo()
            reduceRemainingTicks(skillOne)
            reduceRemainingTicks(skillTwo)
            checkAndTriggerAction(skillOne)
            checkAndTriggerAction(skillTwo)
        }
    })   
}

function checkAndTriggerAction(skill: Skill) {
    if (skill?.triggerAction) {
        if (skill.cooldownRemainingTicks <= 0) {
            // Action tied to skill is triggered.
            skill.action()
            skill.triggerAction = false

            // Start skill cooldown.
            skill.cooldownRemainingTicks = skill.cooldownSetTicks
        }
        else {
            skill.triggerAction = false
        }
    }
}

function reduceRemainingTicks(skill: Skill) {
    if (skill) {
        if (skill.castTimeRemainingTicks > 0) {
            skill.castTimeRemainingTicks--
        }

        if (skill.cooldownRemainingTicks > 0) {
            skill.cooldownRemainingTicks--
        }
    }
}