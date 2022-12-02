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
            checkAndTriggerPressAction(skillOne, ent, worldEngine)
            checkAndTriggerPressAction(skillTwo, ent, worldEngine)
            checkAndTriggerReleaseAction(skillOne, ent, worldEngine)
            checkAndTriggerReleaseAction(skillTwo, ent, worldEngine)
        }
    })   
}

/**
 * Press action performed successfully starts cooldown.
 * @param skill 
 * @param entDoingAction 
 * @param worldEngine 
 */
function checkAndTriggerPressAction(skill: Skill, entDoingAction: Entity, worldEngine: BaseWorldEngine) {
    if (skill?.triggerPressAction) {
        if (skill.cooldownRemainingTicks <= 0) {
            if (skill.pressAction) {
                skill.pressActionPerformed = true;
                skill.pressAction(entDoingAction, worldEngine)
            }

            skill.triggerPressAction = false
            
            // Start skill cooldown.
            if (skill.cooldownBeginsOnPress)
                skill.cooldownRemainingTicks = skill.cooldownSetTicks

            // Set stutter ticks.
            if (entDoingAction.movement) {
                entDoingAction.movement.stutterTicks = skill.stutterSetTicks
            }
        }
        else {
            skill.triggerPressAction = false
        }
    }
}

/**
 * Release action does not trigger cooldown.
 * @param skill 
 * @param entDoingAction 
 * @param worldEngine 
 */
function checkAndTriggerReleaseAction(skill: Skill, entDoingAction: Entity, worldEngine: BaseWorldEngine) {
    if (skill?.triggerReleaseAction) {
        if (skill.releaseAction) {
            if (!skill.cooldownBeginsOnPress) {
                if (skill.pressActionPerformed) {
                    skill.cooldownRemainingTicks = skill.cooldownSetTicks
                    skill.pressActionPerformed = false
                }

                // Action tied to skill is triggered.
                skill.releaseAction(entDoingAction, worldEngine)
            }
            else {
                // Action tied to skill is triggered.
                skill.releaseAction(entDoingAction, worldEngine)
            }

            skill.triggerReleaseAction = false
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