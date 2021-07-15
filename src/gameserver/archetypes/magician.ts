import { ClientEventMessage } from "../../packets/clienteventmessage";
import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setControls } from "../components/control";
import { Entity } from "../serverengine/entity";
import { BaseState } from "../serverengine/basestate";
import { Server } from "../serverengine/server";

export function createMagician(server: Server, worldEngine: BaseState, message: ClientEventMessage, pos: PositionComponent): Entity {
    let magician = new Entity();
    magician.player = { id: message.clientId };
    magician.pos = pos;
    magician.vel = setVelocity(15, 0.5);
    magician.sprite = { url: "./data/textures/snow.png", pixelRatio: 4 };
    // magician.anim = { sequence: "blah", currentFrame: 0 };
    magician.control = setControls();
    magician.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY], 50, 50, -100, -10);

    worldEngine.registerEntity(magician, server);

    return magician;
}