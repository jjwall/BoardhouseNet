import { SkillSlotsComponent } from "../components/skillslots";
import { AnimationComponent } from "../components/animation";
import { BehaviorComponent } from "../components/behavior";
import { PositionComponent } from "../components/position";
import { VelocityComponent } from "../components/velocity";
import { MovementComponent} from "../components/movement";
import { HitboxComponent } from "../components/hitbox";
import { PlayerComponent } from "../components/player";
import { SpriteComponent } from "../components/sprite";
import { FollowComponent } from "../components/follow";
import { TimerComponent } from "../components/timer";

export class Entity {
    netId: number;
    parent?: Entity;
    player: PlayerComponent;
    pos: PositionComponent;
    vel: VelocityComponent;
    sprite: SpriteComponent;
    anim: AnimationComponent;
    hitbox: HitboxComponent;
    movement: MovementComponent;
    behavior: BehaviorComponent;
    timer: TimerComponent;
    skillSlots: SkillSlotsComponent;
    actionReticle: Entity;
    follow: FollowComponent
}