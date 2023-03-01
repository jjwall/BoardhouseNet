import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { PositionComponent } from "../components/position";
import { Entity } from "../serverengine/entity";
import { setTimer } from "../components/timer";

export function createDustPlume(worldEngine: BaseWorldEngine, pos: PositionComponent) {
    let dustPlume = new Entity();
    dustPlume.pos = pos;
    dustPlume.sprite = { url: "./assets/textures/vfx/dust_plume.png", pixelRatio: 4 };
    dustPlume.timer = setTimer(5, () => {
        broadcastDestroyEntitiesMessage([dustPlume], worldEngine.server, worldEngine);
    });
    worldEngine.registerEntity(dustPlume, worldEngine.server);
    broadcastCreateEntitiesMessage([dustPlume], worldEngine.server, worldEngine.worldType);
}