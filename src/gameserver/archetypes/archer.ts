import { ClientEventMessage } from "../../packets/clienteventmessage";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setControls } from "../components/control";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "../server/basestate";

export function createArcher(state: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let archer = new Entity();
    archer.player = { id: message.clientId };
    archer.pos = pos;
    archer.vel = setVelocity(15, 0.5);
    archer.sprite = { url: "./data/textures/archer_girl_from_sketch.png", pixelRatio: 1 };
    // archer.anim = { sequence: "blah", currentFrame: 0 };
    archer.control = setControls();
    state.registerEntity(archer, state.server);

    return archer;
}