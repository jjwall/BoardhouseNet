import { ControlComponent, PositionComponent, SpriteComponent, AnimationComponent } from "./corecomponents";

export class Entity {
    netId: number;
    pos: PositionComponent;
    sprite: SpriteComponent;
    anim: AnimationComponent;
    control: ControlComponent;
    
}