import { ClientEventMessage } from "../../packets/clienteventmessage";
import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setControls } from "../components/control";
import { Entity } from "../states/gameplay/entity";
import { BaseState } from "../server/basestate";

export function createPage(state: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let page = new Entity();
    page.player = { id: message.clientId };
    page.pos = pos;
    page.vel = setVelocity(15, 0.5);
    page.sprite = { url: "./data/textures/msknight.png", pixelRatio: 4 };
    // page.anim = { sequence: "blah", currentFrame: 0 };
    page.control = setControls();
    page.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY], 50, 50, 100, 100);
    state.registerEntity(page, state.server);

    return page;
}