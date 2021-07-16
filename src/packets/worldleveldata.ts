import { WorldTypes } from "./worldtypes";

export interface WorldLevelData {
    worldType: WorldTypes;
    levelTextureUrl: string;
    pixelRatio: number;
    tileWidth: number;
    tileHeight: number;
    canvasTileSetTilesWide: number;
    canvasTileSetTilesHigh: number;
    canvasTileMapTilesWide: number;
    canvasTileMapTilesHigh: number;
    tiles: TileData[];

}

export interface TileData {
    tileNumber: number;
    xPos: number;
    yPos: number;
    rot: number;
    flipX: boolean;
    hitbox?: {
        height: number;
        width: number;
        offsetX: number;
        offsetY: number;
    },
}