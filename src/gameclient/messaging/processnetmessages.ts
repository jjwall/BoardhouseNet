import { NetMessageLoadWorld, NetMessagePlayerWorldTransition, NetWorldMessage, NetWorldEventTypes } from "../../packets/networldmessage";
import { NetActionEventTypes, NetActionMessage, NetMessagePlayerAttackDisplay } from "../../packets/netactionmessage";
import { sendPlayerWorldTransitionMessage } from "./sendclientworldmessages";
import { NetEntityEventTypes } from "../../packets/netentityeventtypes";
import { NetEntityMessage, NetMessageCreateEntities, NetMessageDestroyEntities, NetMessageUpdateEntities } from "../../packets/netentitymessage";
import { renderWorldMap } from "../clientengine/renderworldmap";
import { Message, MessageTypes } from "../../packets/message";
import { ClientEntity } from "../clientengine/cliententity";
import { setHitboxGraphic } from "../components/hitbox";
import { ClientRender } from "../renders/clientrender";
import { setPosition } from "../components/position";
import { setSprite } from "../components/sprite";
import { Client } from "../clientengine/client";
import { Vector3 } from "three";

// Handle message based on the type of NetMessage.
// Will need non-entity messages such as "CREATE_FIRE_BALL" with x,y,z location in Euler direction etc...
export function processNetMessages(client: Client) {
    client.connection.onmessage = function(messageEvent: MessageEvent) {
        const message: Message = JSON.parse(messageEvent.data);
        console.log("boardhouse: back to front message");

        switch (message.messageType) {
            case MessageTypes.NET_ENTITY_MESSAGE:
                processNetEntityMessage(message as NetEntityMessage, client);
                break;
            case MessageTypes.NET_ACTION_MESSAGE:
                processNetActionMessage(message as NetActionMessage, client);
                break;
            case MessageTypes.NET_WORLD_MESSAGE:
                processNetWorldMessage(message as NetWorldMessage, client);
                break;
        }
    }
}

//#region Net Entity Messages

function processNetEntityMessage(message: NetEntityMessage, client: Client) {
    switch (message.eventType) {
        case NetEntityEventTypes.CREATE:
            createEntities(message as NetMessageCreateEntities, client);
            break;
        case NetEntityEventTypes.UPDATE:
            updateEntities(message as NetMessageUpdateEntities, client);
            break;
        case NetEntityEventTypes.DESTROY:
            destroyEntities(message as NetMessageDestroyEntities, client);
            break;
    }
}

// Create front-end representations of EntData list. Should pass in all entities
// using the "global" ecsKey when a player or spectator first joins (or scene transition happens).
function createEntities(message: NetMessageCreateEntities, client: Client) {
    if (message.data.worldType === client.worldType) {
        message.data.ents.forEach(entData => {
            console.log("create entity front");
            console.log(entData);

            // Create a front-end entity for the client that will represent a back-end entity.
            // Don't create the ent twice if it had already been created.
            if (!client.NetIdToEntityMap[entData.netId]) {
                let clientEnt = new ClientEntity();
                const dir = new Vector3(entData.pos.dir.x, entData.pos.dir.y, entData.pos.dir.z);
                clientEnt.netId = entData.netId;
                clientEnt.pos = setPosition(entData.pos.loc.x, entData.pos.loc.y, entData.pos.loc.z, dir, entData.pos.flipX);
                clientEnt.sprite = setSprite(entData.sprite.url, client.gameScene, client, entData.sprite.pixelRatio);
                clientEnt.pos.teleport = entData.pos.teleport;

                if (entData.hitbox)
                    setHitboxGraphic(client, clientEnt.sprite, entData.hitbox);

                if (entData.anim) {
                    // clientEnt.anim = setAnim(...);
                }

                if (entData.player) {
                    clientEnt.player = entData.player;

                    // Set player ent reference if client id matches player id.
                    if (client.currentClientId === entData.player.id) {
                        client.currentPlayerEntity = clientEnt;
                        // Client player ents should have +1 to their z index so they are always rendered over other player ents.
                        client.currentPlayerEntity.pos.loc.z++;
                    }
                }

                client.entityList.push(clientEnt);
                client.NetIdToEntityMap[entData.netId] = clientEnt;
            }
        });
    }
}

// Update front end representation of EntData list.
function updateEntities(message: NetMessageUpdateEntities, client: Client) {
    if (message.data.worldType === client.worldType) {
        message.data.ents.forEach(entData => {
            if (client.NetIdToEntityMap[entData.netId]) {
                let clientEnt = client.NetIdToEntityMap[entData.netId];

                if (clientEnt.sprite && clientEnt.pos) {
                    clientEnt.pos.loc.setX(entData.pos.loc.x);
                    clientEnt.pos.loc.setY(entData.pos.loc.y);
                    clientEnt.pos.dir.setX(entData.pos.dir.x);
                    clientEnt.pos.dir.setY(entData.pos.dir.y);
                    clientEnt.pos.teleport = entData.pos.teleport;
                    clientEnt.pos.flipX = entData.pos.flipX;
                }
        
                // if (clientEnt.anim) {
                    // clientEnt.anim = setAnim(...);
                // }
            }
        });
    }
}

// Destroy front end representations EntData list.
function destroyEntities(message: NetMessageDestroyEntities, client: Client) {
    if (message.data.worldType === client.worldType) {
        message.data.ents.forEach(entData => {
            console.log("destroy entity front");
            const entToDestroy = client.NetIdToEntityMap[entData.netId];
            console.log(client.entityList);

            // Remove from entityList.
            if (client.entityList.indexOf(entToDestroy) !== -1) {
                client.entityList.splice(client.entityList.indexOf(entToDestroy), 1);
            }

            console.log("removing ent from entity list");
            console.log(client.entityList);
        
            // Remove from NetId to Entity map.
            if (client.NetIdToEntityMap[entData.netId]) {
                delete client.NetIdToEntityMap[entData.netId];

                // Remove sprite from scene.
                if (entToDestroy.sprite) {
                    client.gameScene.remove(entToDestroy.sprite);
                }
            }
        });
    }
}

//#endregion

//#region Net Action Messages

function processNetActionMessage(message: NetActionMessage, client: Client) {
    switch (message.eventType) {
        case NetActionEventTypes.PLAYER_ATTACK_ANIM_DISPLAY:
            renderPlayerAttackAnim(message as NetMessagePlayerAttackDisplay, client);
            break;
        // case ...
    }
}

function renderPlayerAttackAnim(message: NetMessagePlayerAttackDisplay, client: Client) {
    if (message.data.worldType === client.worldType) {
        console.log("Attack! - render from server");

        message.data.ents.forEach(entData => {
            // set up render archetypes methods?
            let clientRender = new ClientRender(120);
            const dir = new Vector3(entData.pos.dir.x, entData.pos.dir.y, entData.pos.dir.z);
            clientRender.pos = setPosition(entData.pos.loc.x, entData.pos.loc.y, entData.pos.loc.z, dir, entData.pos.flipX);
            clientRender.sprite = setSprite(entData.sprite.url, client.gameScene, client, entData.sprite.pixelRatio);
            clientRender.pos.teleport = entData.pos.teleport;

            if (entData.anim) {
                // clientEnt.anim = setAnim(...);
            }

            client.renderList.push(clientRender);
        });
    }
}

//#endregion

//#region Net World Messages
function processNetWorldMessage(message: NetWorldMessage, client: Client) {
    switch (message.eventType) {
        case NetWorldEventTypes.LOAD_WORLD:
            loadWorld(message as NetMessageLoadWorld, client);
            break;
        case NetWorldEventTypes.UNLOAD_WORLD:
            unloadWorld(client);
            break;
        case NetWorldEventTypes.PLAYER_WORLD_TRANSITION:
            transitionPlayerClientToNewWorld(message as NetMessagePlayerWorldTransition, client);
            break;
    }
}

function loadWorld(message: NetMessageLoadWorld, client: Client) {
    console.log("load world...");
    console.log(client.worldType);
    // if (client.worldType === message.data.worldType) {

    // Set world type.
    client.worldType = message.data.worldType;

    if (client.tileMeshList.length === 0) // this check is to ensure we don't keep reloading the same map. May need to consider an additional check when loading a new world.
        renderWorldMap(client, message.data);
    // }
}

function unloadWorld(client: Client) {
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

function transitionPlayerClientToNewWorld(message: NetMessagePlayerWorldTransition, client: Client) {
    // Unload current world assets.
    unloadWorld(client);

    // Set new world type client will be rendering.
    client.worldType = message.data.newWorldType;

    // Send client world message that tells server to have player join new world.
    sendPlayerWorldTransitionMessage(client, message.data);
}
//#endregion