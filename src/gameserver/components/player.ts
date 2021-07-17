/**
 * Player component.
 */
export interface PlayerComponent {
    id: string;
    state: PlayerStates
}

export enum PlayerStates {
    LOADED = "LOADED",
    UNLOADED = "UNLOADED",
}