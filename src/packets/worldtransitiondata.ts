import { PlayerClassTypes } from "./playerclasstypes";
import { WorldTypes } from "./worldtypes";

export interface WorldTransitionData {
    clientId: string;
    playerClass: PlayerClassTypes;
    newWorldType: WorldTypes;
    newPos: {
        x: number;
        y: number;
    } 
}