import { AnimationComponent } from "../components/animation";
import { PositionComponent } from "../components/position";
import { VelocityComponent } from "../components/velocity";
import { MovementComponent} from "../components/movement";
import { HitboxComponent } from "../components/hitbox";
import { PlayerComponent } from "../components/player";
import { SpriteComponent } from "../components/sprite";
import { SkillSlotsComponent } from "../components/skillslots";

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
    skillSlots: SkillSlotsComponent;
}