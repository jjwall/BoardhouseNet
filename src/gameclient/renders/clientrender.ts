import { AnimationComponent } from "../components/animation";
import { PositionComponent } from "../components/position";
import { SpriteComponent } from "../components/sprite";

export class ClientRender {
    constructor(ticks: number) {
        this.ticks = ticks; // TODO - get delta time for render ticks as some monitors will render faster than others. Renders should be based on time not render ticks...
    }
    public pos: PositionComponent;
    public sprite: SpriteComponent;
    public anim: AnimationComponent;
    public ticks: number;
}