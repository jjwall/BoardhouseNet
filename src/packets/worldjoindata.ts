import { PlayerClassTypes } from "./playerclasstypes";
import { WorldTypes } from "./worldtypes";

export interface WorldJoinData {
    clientId: string;
    playerClass: PlayerClassTypes;
    worldType: WorldTypes;
}