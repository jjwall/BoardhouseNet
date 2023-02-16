import { AnimationSchema } from "../animationschema";
import { SequenceTypes } from "../sequencetypes";

export const itemPickupArrowAnim: AnimationSchema = {
    [SequenceTypes.DEFAULT]: [
        {
            ticks: 8,
            texture: "./assets/textures/vfx/item_pickup_arrow001.png",
            nextFrame: 1
        },
        {
            ticks: 8,
            texture: "./assets/textures/vfx/item_pickup_arrow002.png",
            nextFrame: 2
        },
        {
            ticks: 8,
            texture: "./assets/textures/vfx/item_pickup_arrow003.png",
            nextFrame: 3
        },
        {
            ticks: 8,
            texture: "./assets/textures/vfx/item_pickup_arrow004.png",
            nextFrame: 0
        },
    ]
}