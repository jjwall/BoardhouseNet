import { bowAndArrowPress, bowAndArrowRelease } from "../actions/bowandarrow";
import { WorldTransitionData } from "../../packets/data/worldtransitiondata";
import { sendPlayerWorldTransitionMessage } from "./sendnetworldmessages";
import { broadcastDestroyEntitiesMessage } from "./sendnetentitymessages";
import { fireballPress, fireballRelease } from "../actions/fireball";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { PositionComponent } from "../components/position";
import { initializeSkill } from "../components/skillslots";
import { ItemData } from "../../packets/data/itemdata";
import { PlayerStates } from "../components/player";
import { basicSwordAttack } from "../actions/sword";
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

/**
 * Does this util method make sense to go here? Should it be in archetype utils?
 * Archetypes -> heroes -> page.ts, mage.ts, archer.ts, heroutils.ts ?
 * @param playerEnt 
 * @param updatedInventory 
 */
export function processPlayerEquipEvent(playerEnt: Entity, updatedInventory: Array<ItemData>) {
    const primaryEquipSlotIndex = 8
    const secondaryEquipSlotIndex = 9
    // TODO: Some sort of back end validation here, easy hack to spoof an inventory and overwrite current back end list.
    // -> should be as easy as making sure the client inventory list matches with server inventory list...
    // -> ...since, no item could be "added" from client, that would happen as a server event only (item drop pick up)
    // TODO: Add type and data to items.
    const processSkillSwap = (newItemData: ItemData, skillOne: boolean) => {
        const setPlayerEquipSkill = skillOne ? playerEnt.skillSlots.setSkillOne : playerEnt.skillSlots.setSkillTwo

        switch (newItemData?.spriteUrl) {
            case "./data/textures/icons/d20.png": // sword
                setPlayerEquipSkill(initializeSkill(6, 20, basicSwordAttack, undefined))
                break
            case "./data/textures/icons/d3403.png": // bow
                setPlayerEquipSkill(initializeSkill(0, 10, bowAndArrowPress, bowAndArrowRelease, false));
                break
            case "./data/textures/icons/d3940.png": // magic staff
                setPlayerEquipSkill(initializeSkill(0, 10, fireballPress, fireballRelease, false));
                break
            default:
                setPlayerEquipSkill(undefined)
        }
    }

    // Skill slot 1 has new item equip.
    if (JSON.stringify(playerEnt.player.inventory[primaryEquipSlotIndex]) !== JSON.stringify(updatedInventory[primaryEquipSlotIndex])) {
        processSkillSwap(updatedInventory[primaryEquipSlotIndex], true)
    }

    // Skill slot 2 has new item equip.
    if (JSON.stringify(playerEnt.player.inventory[secondaryEquipSlotIndex]) !== JSON.stringify(updatedInventory[secondaryEquipSlotIndex])) {
        processSkillSwap(updatedInventory[secondaryEquipSlotIndex], false)
    }

    // Update server side inventory.
    playerEnt.player.inventory = updatedInventory
}