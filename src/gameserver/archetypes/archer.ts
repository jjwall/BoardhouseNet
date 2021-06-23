import { ClientEventMessage } from "../../packets/clienteventmessage";
import { initializeControls } from "../components/initializers";
import { PositionComponent } from "../components/position";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "../server/basestate";

export function createArcher(state: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let archer = new Entity();
    archer.player = { id: message.clientId };
    archer.pos = pos;
    archer.sprite = { url: "./data/textures/archer_girl_from_sketch.png", pixelRatio: 1 };
    // archer.anim = { sequence: "blah", currentFrame: 0 };
    archer.control = initializeControls();
    state.registerEntity(archer, state.server);

    return archer;
}