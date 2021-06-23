import { ControlComponent, SpriteComponent, AnimationComponent, PlayerComponent } from "../../components/corecomponents";
import { PositionComponent } from "../../components/position";

export class Entity {
    netId: number;
    player: PlayerComponent;
    pos: PositionComponent;
    sprite: SpriteComponent;
    anim: AnimationComponent;
    control: ControlComponent;
    
}