import { WorldTransitionData } from "../../packets/data/worldtransitiondata";
import { sendPlayerWorldTransitionMessage } from "./sendnetworldmessages";
import { broadcastDestroyEntitiesMessage } from "./sendnetentitymessages";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { PositionComponent } from "../components/position";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { PlayerStates } from "../components/player";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";

export function findAndDestroyPlayerEntity(worldEngine: BaseWorldEngine, clientId: string, server: Server) {
    const ents = worldEngine.getEntitiesByKey<Entity>("player");
    let entsToDestroy: Entity[] = [];

    ents.forEach(ent => {
        if (ent.player) {
            if (ent.player.id === clientId) {
                entsToDestroy.push(ent);
            }
        }
    });

    if (entsToDestroy.length > 0)
        broadcastDestroyEntitiesMessage(entsToDestroy, server, worldEngine);
}

export function transitionPlayerToAnotherWorld(playerEnt: Entity, currentWorld: BaseWorldEngine, newWorldType: WorldTypes, newPos: PositionComponent) {
    playerEnt.player.state = PlayerStates.UNLOADED;
    playerEnt.pos = newPos; // unncessary

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

export function findPlayerEntityByClientId(worldEngine: BaseWorldEngine, clientId: string): Entity | undefined {
    const playerEnts = worldEngine.getEntitiesByKey<Entity>("player");
    let playerEnt: Entity = undefined;

    playerEnts.forEach(ent => {
        if (ent.player) {
            if (ent.player.id === clientId) {
                playerEnt = ent;
            }
        }
    });

    return playerEnt
}