/**
 * TypeScript TileSet schema based on tile
 */

export interface TileMapSchema {
    tileswide: number;
    tileheight: number;
    tileshigh: number;
    layers: Array<TileMapLayerSchema>;
    tilewidth: number;
}

interface TileMapLayerSchema {
    name: string;
    tiles: Array<TileSchema>;
    number: number;
}

interface TileSchema {
    rot: number;
    y: number;
    tile: number;
    flipX: boolean;
    index: number;
    x: number;
}