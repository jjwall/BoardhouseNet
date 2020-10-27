import { ControlComponent, PositionComponent, SpriteComponent, AnimationComponent, PlayerComponent } from "../../components/corecomponents";

export class Entity {
    netId: number;
    player: PlayerComponent;
    pos: PositionComponent;
    sprite: SpriteComponent;
    anim: AnimationComponent;
    control: ControlComponent;
    
}