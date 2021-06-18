import { ClientEventMessage } from "../../packets/clienteventmessage";
import { PositionComponent } from "../components/corecomponents";
import { initializeControls } from "../components/initializers";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "../server/basestate";

export function createArcher(state: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let archer = new Entity();
    archer.player = { id: message.clientId };
    archer.pos = { x: 450, y: 150, z: 5 };
    archer.sprite = { url: "./data/textures/archer_girl_from_sketch.png", pixelRatio: 1 };
    // archer.anim = { sequence: "blah", currentFrame: 0 };
    archer.control = initializeControls();
    state.registerEntity(archer, state.server);

    return archer;
}