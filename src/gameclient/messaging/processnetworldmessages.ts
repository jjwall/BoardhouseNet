import { NetMessageLoadWorld, NetMessagePlayerWorldTransition } from "../../packets/networldmessage";
import { sendPlayerWorldTransitionMessage } from "./sendclientworldmessages";
import { renderWorldMap } from "../clientengine/renderworldmap";
import { Client } from "../clientengine/client";

export function loadWorld(message: NetMessageLoadWorld, client: Client) {
    console.log("load world...");
    console.log(client.worldType);
    // if (client.worldType === message.data.worldType) {

    // Set world type.
    client.worldType = message.data.worldType;

    if (client.tileMeshList.length === 0) // this check is to ensure we don't keep reloading the same map. May need to consider an additional check when loading a new world.
        renderWorldMap(client, message.data);
    // }
}

export function unloadWorld(client: Client) {
    // Remove tile meshes from game scene.
    if (client.tileMeshList.length > 0) {
        client.tileMeshList.forEach(mesh => {
            client.gameScene.remove(mesh);
        });
    }

    // Empty tile mesh list.
    client.tileMeshList = [];

    // Remove entity meshs from game scene.
    if (client.entityList.length > 0) {
        client.entityList.forEach(entity => {
            client.gameScene.remove(entity.sprite);
        });
    }
    
    // Empty entity list.
    client.entityList = [];

    // Remove render meshes from game scene.
    if (client.renderList.length > 0) {
        client.renderList.forEach(render => {
            client.gameScene.remove(render.sprite);
        });
    }

    // Empty render list.
    client.renderList = [];
}

export function transitionPlayerClientToNewWorld(message: NetMessagePlayerWorldTransition, client: Client) {
    // Unload current world assets.
    unloadWorld(client);

    // Set new world type client will be rendering.
    client.worldType = message.data.newWorldType;

    // Send client world message that tells server to have player join new world.
    sendPlayerWorldTransitionMessage(client, message.data);
}