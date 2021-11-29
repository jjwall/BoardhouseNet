import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setMovement } from "../components/movement";
import { Entity } from "../serverengine/entity";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Server } from "../serverengine/server";
import { PlayerStates } from "../components/player";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { necroAnim } from "../../modules/animations/animationdata/necro";
import { zelfinAnim } from "../../modules/animations/animationdata/zelfin"

export function createMagician(server: Server, worldEngine: BaseWorldEngine, clientId: string, pos: PositionComponent): Entity {
    let magician = new Entity();
    magician.player = { id: clientId, state: PlayerStates.UNLOADED, class: PlayerClassTypes.MAGICIAN };
    magician.pos = pos;
    magician.vel = setVelocity(15, 0.5);
    magician.sprite = { url: "./data/textures/zelfin001.png", pixelRatio: 8 };
    magician.anim = { sequence: SequenceTypes.IDLE, blob: zelfinAnim };
    magician.movement = setMovement();
    magician.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY], 50, 50, 0, -50);

    worldEngine.registerEntity(magician, server);

    return magician;
}