import { ClientEventMessage } from "../../packets/clienteventmessage";
import { initializeControls } from "../components/initializers";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "../server/basestate";

export function createMagician(state: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let magician = new Entity();
    magician.player = { id: message.clientId };
    magician.pos = pos;
    magician.vel = setVelocity(1);
    magician.sprite = { url: "./data/textures/snow.png", pixelRatio: 4 };
    // magician.anim = { sequence: "blah", currentFrame: 0 };
    magician.control = initializeControls();
    state.registerEntity(magician, state.server);

    return magician;
}