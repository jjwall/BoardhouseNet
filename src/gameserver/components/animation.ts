import { AnimationSchema } from "../../modules/animations/animationschema";
import { SequenceTypes } from "../../modules/animations/sequencetypes";

/**
 * Animation component.
 */
 export interface AnimationComponent {
    sequence: SequenceTypes,
    blob: AnimationSchema,
}