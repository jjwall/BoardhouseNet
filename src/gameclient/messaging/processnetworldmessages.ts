import { NetMessageLoadWorld, NetMessagePlayerChatMessage, NetMessagePlayerItemPickup, NetMessagePlayerNotification, NetMessagePlayerReconcileInventory, NetMessagePlayerWorldTransition } from "../../packets/messages/networldmessage";
import { renderSceneFadeIn, renderSceneFadeOut } from "../renders/scenetransitions";
import { sendPlayerWorldTransitionMessage } from "./sendclientworldmessages";
import { renderWorldMap } from "../clientengine/renderworldmap";
import { Client } from "../clientengine/client";

export function loadWorld(message: NetMessageLoadWorld, client: Client) {
    console.log("load world...");
    console.log(client.worldType);
    // if (client.worldType === message.data.worldType) {

    // Set world type.
    client.worldType = message.data.worldType;

    if (client.tileMeshList.length === 0) { // this check is to ensure we don't keep reloading the same map. May need to consider an additional check when loading a new world.
        renderWorldMap(client, message.data);
        renderSceneFadeIn(client);
    }
}

export function unloadWorld(client: Client) {
    console.log("unloading world...");

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
    client.NetIdToEntityMap = {};

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
    // unloadWorld(client);
    renderSceneFadeOut(client, () => {
        if (!client.sceneTransitionDone) {
            unloadWorld(client);
            client.sceneTransitionDone = true;
        }
    });

    // Set new world type client will be rendering.
    client.worldType = message.data.newWorldType;

    // Send client world message that tells server to have player join new world.
    sendPlayerWorldTransitionMessage(client, message.data);
}

export function playerPickupItem(message: NetMessagePlayerItemPickup, client: Client) {
    if (client.currentClientId === message.data.pickupClientId) {
        const clientState = client.getUIState()
        const firstAvailableSlotIndex = clientState.clientInventory.findIndex(element => !element);

        // Note: this check shouldn't be necessary since this logic should be run on server.
        // Message data could include things like, slot index to render item at.
        if (firstAvailableSlotIndex > -1) {
            // There's available space for item, place in first available slot.
            clientState.clientInventory[firstAvailableSlotIndex] = {
                spriteUrl: message.data.item.spriteUrl,
                onDragSpriteUrl: message.data.item.onDragSpriteUrl
            }

            client.rootComponent.setClientInventory(clientState.clientInventory)
        } else {
            console.log("Render: not enough space")
        }
    }
}

export function playerReconcileInventory(message: NetMessagePlayerReconcileInventory, client: Client) {
    if (client.currentClientId === message.data.clientId) {
        client.rootComponent.setClientInventory(message.data.inventory);
    }
}

// This is a client specific notification, perhaps we have a broadcast one too?
export function notifyPlayer(message: NetMessagePlayerNotification, client: Client) {
    if (client.currentClientId === message.data.clientId) {
        client.rootComponent.setNotificationMessage(message.data)
    }
}

export function appendPlayerChatMessage(message: NetMessagePlayerChatMessage, client: Client) {
    if (message.data.worldType === client.worldType) {
        // Append username with playerId.
        // Perhaps we only append playerId if a default username is chosen.
        // console.log(`${message.data.clientUsername} (PlayerId: ${message.data.clientId}): ${message.data.chatMessage}`);
        client.rootComponent.appendChatHistory(message.data);
        console.log(client.getUIState().chatHistory);
    }
}