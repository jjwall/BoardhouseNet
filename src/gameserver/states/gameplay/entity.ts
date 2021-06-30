import { VelocityComponent } from "../../components/velocity";
import { ControlComponent} from "../../components/corecomponents";
import { AnimationComponent } from "../../components/animation";
import { PositionComponent } from "../../components/position";
import { PlayerComponent } from "../../components/player";
import { SpriteComponent } from "../../components/sprite";

export class Entity {
    netId: number;
    player: PlayerComponent;
    pos: PositionComponent;
    vel: VelocityComponent;
    sprite: SpriteComponent;
    anim: AnimationComponent;
    control: ControlComponent;
}