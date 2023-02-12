import { WorldTypes } from "../enums/worldtypes";
import { ItemData } from "./itemdata";

export interface InventoryData {
    clientId: string;
    worldType: WorldTypes
    inventory: ItemData[]
}