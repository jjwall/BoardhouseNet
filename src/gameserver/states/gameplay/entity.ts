import { AnimationComponent } from "../../components/animation";
import { PositionComponent } from "../../components/position";
import { VelocityComponent } from "../../components/velocity";
import { ControlComponent} from "../../components/control";
import { HitBoxComponent } from "../../components/hitbox";
import { PlayerComponent } from "../../components/player";
import { SpriteComponent } from "../../components/sprite";

export class Entity {
    netId: number;
    player: PlayerComponent;
    pos: PositionComponent;
    vel: VelocityComponent;
    sprite: SpriteComponent;
    anim: AnimationComponent;
    hitBox: HitBoxComponent;
    control: ControlComponent;
}