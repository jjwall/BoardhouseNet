import { PlayerClassTypes } from "../enums/playerclasstypes";
import { WorldTypes } from "../enums/worldtypes";
import { ItemData } from "./itemdata";

export interface WorldTransitionData {
    clientId: string;
    playerClass: PlayerClassTypes;
    playerInventory: ItemData[]
    newWorldType: WorldTypes;
    newPos: {
        x: number;
        y: number;
    } 
}