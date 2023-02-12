import { WorldTransitionData } from "../../packets/data/worldtransitiondata";
import { sendPlayerWorldTransitionMessage } from "./sendnetworldmessages";
import { broadcastDestroyEntitiesMessage } from "./sendnetentitymessages";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { PositionComponent } from "../components/position";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { PlayerStates } from "../components/player";
import { Entity } from "../serverengine/entity";

export function findAndDestroyPlayerEntity(worldEngine: BaseWorldEngine, clientId: string) {
    const playerEntToDestroy = findPlayerEntityByClientId(worldEngine, clientId)

    if (playerEntToDestroy)
        broadcastDestroyEntitiesMessage([playerEntToDestroy], worldEngine.server, worldEngine)
}

export function transitionPlayerToAnotherWorld(playerEnt: Entity, currentWorld: BaseWorldEngine, newWorldType: WorldTypes, newPos: PositionComponent) {
    playerEnt.player.state = PlayerStates.UNLOADED;
    playerEnt.pos = newPos; // unncessary

    // Remove player entity from current World.
    findAndDestroyPlayerEntity(currentWorld, playerEnt.player.id);

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

export function findPlayerEntityByClientId(worldEngine: BaseWorldEngine, clientId: string): Entity | undefined {
    const playerEnts = worldEngine.getEntitiesByKey<Entity>("player")
    const playerEnt = playerEnts.find(ent => ent.player.id === clientId)
    return playerEnt
}