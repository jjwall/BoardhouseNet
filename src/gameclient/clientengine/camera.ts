import { ClientEntity } from "./cliententity";
import { Client } from "./client";
import { Vector3 } from "three";

export function centerCameraOnPlayer(client: Client, playerEnt: ClientEntity) {
    // Center camera over current Player Entity.
    if (playerEnt) {
        let cx = playerEnt.pos.loc.x;
        let cy = playerEnt.pos.loc.y;

        // Ensure camera doesn't scroll past world edges.
        if (client.worldHeight > 0 && client.worldWidth > 0) {
            cx = Math.max(cx, -client.worldWidth / 2 + client.screenWidth / 2);
            cx = Math.min(cx, client.worldWidth / 2 - client.screenWidth / 2);
    
            cy = Math.max(cy, -client.worldHeight / 2 + client.screenHeight / 2);
            cy = Math.min(cy, client.worldHeight / 2 - client.screenHeight / 2);
        }

        const targetPos = new Vector3(
            cx - client.screenWidth / 2, 
            cy - client.screenHeight / 2, 
            0,
        );

        //TODO: switch to framerate-independent damping to solve for tile seam clipping on camera pan.
        if (playerEnt.pos.teleport)
            client.gameCamera.position.copy(targetPos);
        else
            client.gameCamera.position.lerp(targetPos, 0.2);
    }
}