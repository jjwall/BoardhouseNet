import { findAndDestroyPlayerEntity } from "../serverengine/setupgameserver";
import { sendUnloadOldWorldLoadNewWorldMessage } from "./sendmessages";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { WorldTypes } from "../../packets/worldtypes";
import { PlayerStates } from "../components/player";
import { Entity } from "../serverengine/entity";

export function sendPlayerToAnotherWorld(playerEnt: Entity, currentWorld: BaseWorldEngine, newWorldType: WorldTypes) {
    playerEnt.player.state = PlayerStates.UNLOADED;
    findAndDestroyPlayerEntity(currentWorld, playerEnt.player.id, currentWorld.server);
    const castleWorld = currentWorld.server.worldEngines.find(worldEngine => worldEngine.worldType === WorldTypes.CASTLE);

    // TODO: simplify "data"
    // this method can probably be simplified, i.e. don't need to "find" castle world
    sendUnloadOldWorldLoadNewWorldMessage(currentWorld.server, castleWorld.worldLevelData, playerEnt.player.id, newWorldType);
};