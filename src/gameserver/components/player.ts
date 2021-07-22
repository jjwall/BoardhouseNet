import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";

/**
 * Player component.
 */
export interface PlayerComponent {
    id: string;
    state: PlayerStates;
    class: PlayerClassTypes;
}

export enum PlayerStates {
    LOADED = "LOADED",
    UNLOADED = "UNLOADED",
}