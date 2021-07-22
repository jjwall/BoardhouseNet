import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setControls } from "../components/control";
import { Entity } from "../serverengine/entity";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Server } from "../serverengine/server";
import { PlayerStates } from "../components/player";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";

export function createPage(server: Server, worldEngine: BaseWorldEngine, clientId: string, pos: PositionComponent): Entity {
    let page = new Entity();
    page.player = { id: clientId, state: PlayerStates.UNLOADED, class: PlayerClassTypes.PAGE };
    page.pos = pos;
    page.vel = setVelocity(15, 0.5);
    page.sprite = { url: "./data/textures/msknight.png", pixelRatio: 4 };
    // page.anim = { sequence: "blah", currentFrame: 0 };
    page.control = setControls();
    page.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY], 128, 128);

    worldEngine.registerEntity(page, server);

    return page;
}