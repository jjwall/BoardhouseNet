import { findAndDestroyPlayerEntity } from "../serverengine/setupgameserver";
import { sendPlayerWorldTransitionMessage } from "./sendmessages";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { PositionComponent } from "../components/position";
import { WorldTypes } from "../../packets/worldtypes";
import { PlayerStates } from "../components/player";
import { Entity } from "../serverengine/entity";
import { WorldTransitionData } from "../../packets/worldtransitiondata";

export function sendPlayerToAnotherWorld(playerEnt: Entity, currentWorld: BaseWorldEngine, newWorldType: WorldTypes, newPos: PositionComponent) {
    playerEnt.player.state = PlayerStates.UNLOADED;
    playerEnt.pos = newPos;

    // Remove player entity from current World.
    findAndDestroyPlayerEntity(currentWorld, playerEnt.player.id, currentWorld.server);

    // Unncecssary, but do this to "satisfy" current NetWorldMessage conditions...
    const castleWorld = currentWorld.server.worldEngines.find(worldEngine => worldEngine.worldType === WorldTypes.CASTLE);

    // TODO: simplify "data"
    // this method can probably be simplified, i.e. don't need to "find" castle world

    const data: WorldTransitionData = {
        playerClass: playerEnt.player.class,
        clientId: playerEnt.player.id,
        newWorldType: newWorldType,
        newPos: {
            x: newPos.loc.x,
            y: newPos.loc.y
        }
    }

    sendPlayerWorldTransitionMessage(currentWorld.server, data, playerEnt.player.id, newWorldType);
};