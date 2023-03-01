import { PlayerClassTypes } from "../enums/playerclasstypes";
import { WorldTypes } from "../enums/worldtypes";

export interface WorldJoinData {
    clientId: string;
    username: string;
    playerClass: PlayerClassTypes;
    worldType: WorldTypes;
}