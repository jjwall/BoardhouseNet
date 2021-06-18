import { ClientEventMessage } from "../../packets/clienteventmessage";
import { PositionComponent } from "../components/corecomponents";
import { initializeControls } from "../components/initializers";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "../server/basestate";

export function createMagician(state: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let magician = new Entity();
    magician.player = { id: message.clientId };
    magician.pos = pos;
    magician.sprite = { url: "./data/textures/snow.png", pixelRatio: 4 };
    // magician.anim = { sequence: "blah", currentFrame: 0 };
    magician.control = initializeControls();
    state.registerEntity(magician, state.server);

    return magician;
}