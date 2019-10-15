import { ControlComponent, PositionComponent, SpriteComponent } from "./corecomponents";

export class Entity {
    netId: number;
    pos: PositionComponent;
    control: ControlComponent;
    sprite: SpriteComponent;
    
}