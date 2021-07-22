import { PlayerClassTypes } from "../enums/playerclasstypes";
import { WorldTypes } from "../enums/worldtypes";

export interface WorldJoinData {
    clientId: string;
    playerClass: PlayerClassTypes;
    worldType: WorldTypes;
}