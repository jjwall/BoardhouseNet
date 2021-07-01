import { ClientEventMessage } from "../../packets/clienteventmessage";
import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setControls } from "../components/control";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "../server/basestate";
import { Mesh } from "three";

export function createArcher(state: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let archer = new Entity();
    archer.player = { id: message.clientId };
    archer.pos = pos;
    archer.vel = setVelocity(15, 0.5);
    archer.sprite = { url: "./data/textures/archer_girl_from_sketch.png", pixelRatio: 1 };
    // archer.anim = { sequence: "blah", currentFrame: 0 };
    archer.control = setControls();
    archer.hitbox = setHitbox(new Mesh(), HitboxTypes.PLAYER, [HitboxTypes.ENEMY], 50, 50, 100, -10);
    state.registerEntity(archer, state.server);

    return archer;
}