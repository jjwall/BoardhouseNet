import { ClientEventMessage } from "../../packets/clienteventmessage";
import { initializeControls } from "../components/initializers";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "../server/basestate";

export function createPage(state: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let page = new Entity();
    page.player = { id: message.clientId };
    page.pos = pos;
    page.vel = setVelocity(15, 0.5);
    page.sprite = { url: "./data/textures/msknight.png", pixelRatio: 4 };
    // page.anim = { sequence: "blah", currentFrame: 0 };
    page.control = initializeControls();
    state.registerEntity(page, state.server);

    return page;
}