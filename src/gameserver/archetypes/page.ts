import { ClientEventMessage } from "../../packets/clienteventmessage";
import { PositionComponent } from "../components/corecomponents";
import { initializeControls } from "../components/initializers";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "../server/basestate";

export function createPage(state: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let page = new Entity();
    page.player = { id: message.clientId };
    page.pos = pos;
    page.sprite = { url: "./data/textures/msknight.png", pixelRatio: 4 };
    // page.anim = { sequence: "blah", currentFrame: 0 };
    page.control = initializeControls();
    state.registerEntity(page, state.server);

    return page;
}