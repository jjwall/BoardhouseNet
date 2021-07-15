// *** OBSOLETE IN FACOR OF RENDERWORLDMAP.TS ***

// import { BufferGeometry, Vector3,Mesh, NearestFilter, MeshBasicMaterial, BufferAttribute } from "three";
// import { TileMapSchema } from "../../modules/tilemapping/tilemapschema";
// import { Client } from "./client";

// // Render one time when level loads.
// export function renderTileMap(client: Client, tileSetTextureUrl: string, tileMapData: TileMapSchema, pixelRatio: number) {
//     // Remove current tilemap render if exists.
//     if (client.tileMeshList.length > 0) {
//         client.tileMeshList.forEach(mesh =>{
//             client.gameScene.remove(mesh);
//         });
//     }
//     client.tileMeshList = [];

//     const tileSetTexture = client.getTexture(tileSetTextureUrl);
//     const tileHeight = tileMapData.tileheight; // in pixels
//     const tileWidth = tileMapData.tilewidth; // in pixels
//     const canvasWidth = tileSetTexture.image.width / tileWidth; // # of tiles wide (from tileset not map)
//     const canvasHeight = tileSetTexture.image.height / tileHeight; // # of tiles high (from tileset not map)
//     const scaledHeight = tileHeight*pixelRatio;
//     const scaledWidth = tileWidth*pixelRatio;
//     const uMultiple = tileWidth / (canvasWidth * tileWidth);
//     const vMultiple = tileHeight / (canvasHeight * tileHeight);

//     // Set magFilter to nearest for crisp looking pixels.
//     tileSetTexture.magFilter = NearestFilter;

//     // Set worldWidth and worldHeight on client.
//     client.worldWidth = scaledWidth * tileMapData.tileswide;
//     client.worldHeight = scaledHeight * tileMapData.tileshigh;

//     tileMapData.layers.forEach(layer => {
//         layer.tiles.forEach(tile => {
//             const tileNumber = tile.tile;
//             const posX = tile.x*scaledWidth + scaledWidth/2;
//             const posY = scaledHeight*canvasHeight - tile.y*scaledHeight + scaledHeight/2;
//             const v = canvasHeight - Math.floor(tileNumber / canvasWidth) - 1;
//             const u = tileNumber % canvasWidth;
//             const material = new MeshBasicMaterial({ map: tileSetTexture, transparent: true });
//             const geometry = new BufferGeometry();
//             // "8" comes from tile width or height divided by 2.
//             const positions = new Float32Array([
//                 -8, 8, 0,
//                 8, 8, 0,
//                 -8, -8, 0,
//                 8, -8, 0,
//                 -8, -8, 0,
//                 8, 8, 0,
//             ]).map(x => x * pixelRatio);
//             const uvs = new Float32Array([
//                 u*uMultiple, (v+1)*vMultiple,
//                 (u+1)*uMultiple, (v+1)*vMultiple,
//                 (u)*uMultiple, (v)*vMultiple,
//                 (u+1)*uMultiple, (v)*vMultiple,
//                 (u)*uMultiple, (v)*vMultiple,
//                 (u+1)*uMultiple, (v+1)*vMultiple,
//             ]);
//             const normals = new Float32Array([
//                 0, 0, 1,
//                 0, 0, 1,
//                 0, 0, 1,
//                 0, 0, 1,
//                 0, 0, 1,
//                 0, 0, 1,
//             ]);

//             geometry.setAttribute('position', new BufferAttribute(positions, 3));
//             geometry.setAttribute('normal', new BufferAttribute(normals, 3));
//             geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
//             geometry.setIndex([0, 2, 1, 1, 2, 3]);

//             const tileMesh = new Mesh(geometry, material);
//             const position = new Vector3(posX, posY, 1);
//             const deg = 90 * tile.rot;
//             tileMesh.position.copy(position);
//             tileMesh.rotateZ(-deg*Math.PI / 180);

//             if (tile.flipX) {
//                 tileMesh.scale.x = -1;
//             }

//             client.tileMeshList.push(tileMesh);
//             client.gameScene.add(tileMesh);
//         });
//     });
// }