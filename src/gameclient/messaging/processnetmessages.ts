import { NetWorldEventTypes, NetWorldMessage } from "../../packets/networldmessage";
import { NetEntityEventTypes } from "../../packets/netentityeventtypes";
import { NetEntityMessage } from "../../packets/netentitymessage";
import { NetEventMessage } from "../../packets/neteventmessage";
import { NetEventTypes } from "../../packets/neteventtypes";
import { MessageTypes } from "../../packets/messagetypes";
import { setHitboxGraphic } from "../components/hitbox";
import { ClientRender } from "../renders/clientrender";
import { ClientEntity } from "../client/cliententity";
import { setPosition } from "../components/position";
import { setSprite } from "../components/sprite";
import { Message } from "../../packets/message";
import { Client } from "../client/client";
import { Vector3 } from "three";
import { renderWorldMap } from "../client/renderworldmap";

// Handle message based on the type of NetMessage.
// Will need non-entity messages such as "CREATE_FIRE_BALL" with x,y,z location in Euler direction etc...
export function processNetMessages(client: Client) {
    client.connection.onmessage = function(messageEvent: MessageEvent) {
        const message: Message = JSON.parse(messageEvent.data);
        console.log("boardhouse: back to front message");

        if (client.worldType === message.worldType) {
            switch (message.messageType) {
                case MessageTypes.NET_ENTITY_MESSAGE:
                    processNetEntityMessage(message as NetEntityMessage, client);
                    break;
                case MessageTypes.NET_EVENT_MESSAGE:
                    processNetEventMessage(message as NetEventMessage, client);
                    break;
                case MessageTypes.NET_WORLD_MESSAGE:
                    processNetWorldMessage(message as NetWorldMessage, client);
                    break;
            }
        }
    }
}

//#region Net Entity Messages

function processNetEntityMessage(message: NetEntityMessage, client: Client) {
    switch (message.eventType) {
        case NetEntityEventTypes.CREATE:
            createEntities(message, client);
            break;
        case NetEntityEventTypes.UPDATE:
            updateEntities(message, client);
            break;
        case NetEntityEventTypes.DESTROY:
            destroyEntities(message, client);
            break;
    }
}

// Create front-end representations of EntData list. Should pass in all entities
// using the "global" ecsKey when a player or spectator first joins (or scene transition happens).
function createEntities(message: NetEntityMessage, client: Client) {
    message.data.forEach(entData => {
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

// Update front end representation of EntData list.
function updateEntities(message: NetEntityMessage, client: Client) {
    message.data.forEach(entData => {
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

// Destroy front end representations EntData list.
function destroyEntities(message: NetEntityMessage, client: Client) {
    message.data.forEach(entData => {
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
    })
}

//#endregion

//#region Net Event Messages

function processNetEventMessage(message: NetEventMessage, client: Client) {
    switch (message.eventType) {
        case NetEventTypes.PLAYER_ATTACK_ANIM_DISPLAY:
            renderPlayerAttackAnim(message, client);
            break;
        // case ...
    }
}

function renderPlayerAttackAnim(message: NetEventMessage, client: Client) {
    console.log("Attack! - render from server");
    // taken from create ent

    message.data.forEach(entData => {
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

//#endregion

//#region Net World Messages
function processNetWorldMessage(message: NetWorldMessage, client: Client) {
    switch (message.eventType) {
        case NetWorldEventTypes.LOAD_WORLD:
            loadWorld(message, client);
            break;
        // case ...
    }
}

function loadWorld(message: NetWorldMessage, client: Client) {
    if (client.worldType === message.data.worldType) {
        if (client.tileMeshList.length === 0) // this check is to ensure we don't keep reloading the same map. May need to consider an additional check when loading a new world.
            renderWorldMap(client, message.data);
    }
}
//#endregion