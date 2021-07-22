import { PlayerClassTypes } from "../enums/playerclasstypes";
import { WorldTypes } from "../enums/worldtypes";

export interface WorldTransitionData {
    clientId: string;
    playerClass: PlayerClassTypes;
    newWorldType: WorldTypes;
    newPos: {
        x: number;
        y: number;
    } 
}