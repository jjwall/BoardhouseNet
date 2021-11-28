import { AnimationComponent } from "../components/animation";
import { SpriteComponent } from "../components/sprite";
import { Entity } from "../serverengine/entity";

// These will change...
export interface BasicActionParameters {
    castingEnt: Entity
    offsetPosX: number
    offsetPosY: number
    exactPosX?: number
    exactPosY?: number
    castTime: number
    castDuration: number
    cooldown: number
    actionSprite: SpriteComponent
    actionAnim?: AnimationComponent

}

function createBasicAction(paramObj: BasicActionParameters): Entity {
    let action: Entity
    return action
}