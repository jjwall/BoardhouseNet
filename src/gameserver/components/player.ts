import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { ItemData } from "../../packets/data/itemdata";

/**
 * Player component.
 */
export interface PlayerComponent {
    id: string;
    state: PlayerStates;
    class: PlayerClassTypes;
    inventory: Array<ItemData | undefined>;
}

export function setPlayer(clientId: string, state: PlayerStates, _class: PlayerClassTypes, inventory: Array<ItemData>): PlayerComponent {
    return { id: clientId, state: state, class: _class, inventory: inventory };
}

export enum PlayerStates {
    LOADED = "LOADED",
    UNLOADED = "UNLOADED",
}