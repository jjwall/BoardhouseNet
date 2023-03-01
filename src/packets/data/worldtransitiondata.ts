import { PlayerClassTypes } from "../enums/playerclasstypes";
import { WorldTypes } from "../enums/worldtypes";
import { StatsData } from "./statsdata";
import { ItemData } from "./itemdata";

export interface WorldTransitionData {
    clientId: string;
    playerClass: PlayerClassTypes;
    playerInventory: ItemData[];
    playerStats: StatsData;
    newWorldType: WorldTypes;
    newPos: {
        x: number;
        y: number;
    } 
}