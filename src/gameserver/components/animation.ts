import { AnimationSchema } from "../../modules/animations/animationschema";
import { SequenceTypes } from "../../modules/animations/sequencetypes";

/**
 * Animation component.
 */
 export interface AnimationComponent {
    sequence: SequenceTypes,
    blob: AnimationSchema,
}

/**
 * Set animation component.
 * @param blob 
 * @param startingSequence Default to SequenceTypes.DEFAULT if not set.
 * @returns 
 */
export function setAnim(blob: AnimationSchema, startingSequence?: SequenceTypes) {
    let anim: AnimationComponent = { sequence: SequenceTypes.DEFAULT, blob: blob };
    
    if (startingSequence)
        anim.sequence = startingSequence

    return anim
}
