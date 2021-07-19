import { findAndDestroyPlayerEntity } from "../serverengine/setupgameserver";
import { sendPlayerWorldTransitionMessage } from "./sendmessages";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { PositionComponent } from "../components/position";
import { WorldTypes } from "../../packets/worldtypes";
import { PlayerStates } from "../components/player";
import { Entity } from "../serverengine/entity";

export function sendPlayerToAnotherWorld(playerEnt: Entity, currentWorld: BaseWorldEngine, newWorldType: WorldTypes, newPos: PositionComponent) {
    playerEnt.player.state = PlayerStates.UNLOADED;
    playerEnt.pos = newPos;

    // Remove player entity from current World.
    findAndDestroyPlayerEntity(currentWorld, playerEnt.player.id, currentWorld.server);

    // Unncecssary, but do this to "satisfy" current NetWorldMessage conditions...
    const castleWorld = currentWorld.server.worldEngines.find(worldEngine => worldEngine.worldType === WorldTypes.CASTLE);

    // TODO: simplify "data"
    // this method can probably be simplified, i.e. don't need to "find" castle world
    sendPlayerWorldTransitionMessage(currentWorld.server, castleWorld.worldLevelData, playerEnt.player.id, newWorldType);
};