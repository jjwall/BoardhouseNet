import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, NearestFilter, Vector3 } from "three";
import { WorldLevelData } from "../../packets/worldleveldata";
import { Client } from "./client";

export function renderWorldMap(client: Client, worldLevelData: WorldLevelData) {
    // Remove current tilemap render if exists.
    if (client.tileMeshList.length > 0) {
        client.tileMeshList.forEach(mesh =>{
            client.gameScene.remove(mesh);
        });
    }
    client.tileMeshList = [];

    const tileSetTexture = client.getTexture(worldLevelData.levelTextureUrl);
    const tileHeight = worldLevelData.tileHeight;
    const tileWidth = worldLevelData.tileWidth;
    const pixelRatio = worldLevelData.pixelRatio;
    const canvasTileSetTilesHigh = worldLevelData.canvasTileSetTilesHigh;
    const canvasTileSetTilesWide = worldLevelData.canvasTileSetTilesWide;
    const scaledHeight = tileHeight * worldLevelData.pixelRatio;
    const scaledWidth = tileWidth * worldLevelData.pixelRatio;
    const uMultiple = tileWidth / (canvasTileSetTilesWide * tileWidth);
    const vMultiple = tileHeight / (canvasTileSetTilesHigh * tileHeight);

    // Set magFilter to nearest for crisp looking pixels.
    tileSetTexture.magFilter = NearestFilter;

    // Set worldWidth and worldHeight on client.
    client.worldHeight = scaledHeight * worldLevelData.canvasTileMapTilesHigh;
    client.worldWidth = scaledWidth * worldLevelData.canvasTileMapTilesWide;

    worldLevelData.tiles.forEach(tile => {
        const tileNumber = tile.tileNumber;
        const v = canvasTileSetTilesHigh - Math.floor(tileNumber / canvasTileSetTilesWide) - 1;
        const u = tileNumber % canvasTileSetTilesWide;
        const material = new MeshBasicMaterial({ map: tileSetTexture, transparent: true });
        const geometry = new BufferGeometry();
        // "8" comes from tile width or height divided by 2.
        const positions = new Float32Array([
            -8, 8, 0,
            8, 8, 0,
            -8, -8, 0,
            8, -8, 0,
            -8, -8, 0,
            8, 8, 0,
        ]).map(x => x * pixelRatio);
        const uvs = new Float32Array([
            u*uMultiple, (v+1)*vMultiple,
            (u+1)*uMultiple, (v+1)*vMultiple,
            (u)*uMultiple, (v)*vMultiple,
            (u+1)*uMultiple, (v)*vMultiple,
            (u)*uMultiple, (v)*vMultiple,
            (u+1)*uMultiple, (v+1)*vMultiple,
        ]);
        const normals = new Float32Array([
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ]);

        geometry.setAttribute('position', new BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
        geometry.setIndex([0, 2, 1, 1, 2, 3]);

        const tileMesh = new Mesh(geometry, material);
        const position = new Vector3(tile.xPos, tile.yPos, 1);
        const deg = 90 * tile.rot;
        tileMesh.position.copy(position);
        tileMesh.rotateZ(-deg*Math.PI / 180);

        if (tile.flipX) {
            tileMesh.scale.x = -1;
        }

        // if (client.displayHitBoxes) {
        // ...
        //     tileMesh.add(hitboxGraphic);
        // }

        client.tileMeshList.push(tileMesh);
        client.gameScene.add(tileMesh);
    });
}