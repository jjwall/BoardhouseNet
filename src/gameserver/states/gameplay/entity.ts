import { VelocityComponent } from "../../components/velocity";
import { ControlComponent, SpriteComponent, AnimationComponent, PlayerComponent } from "../../components/corecomponents";
import { PositionComponent } from "../../components/position";

export class Entity {
    netId: number;
    player: PlayerComponent;
    pos: PositionComponent;
    vel: VelocityComponent;
    sprite: SpriteComponent;
    anim: AnimationComponent;
    control: ControlComponent;
    
}