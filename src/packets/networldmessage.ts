import { Message } from "./message";
import { WorldLevelData } from "./worldleveldata";

export interface NetWorldMessage extends Message {
    eventType: NetWorldEventTypes;
    data: WorldLevelData; //WorldData; // will use Entity Data to display anims (for now)
}

export enum NetWorldEventTypes {
    LOAD_WORLD = "LOAD_WORLD", // load tile world?
    UNLOAD_WORLD = "UNLOAD_WORLD" // this would be a client side event
}

// export interface WorldData {
//     worldType: WorldTypes;
//     tiles: TileData[];
//     // ...
// }

// export interface TileData {
//     // ...
// }

export enum WorldTypes {
    WORLD_1 = "WORLD_1",
    WORLD_2 = "WORLD_2",
    // ...
}