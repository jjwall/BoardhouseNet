import { ClientEventMessage } from "../../packets/clienteventmessage";
import { NetEntityMessage } from "../../packets/netentitymessage";
import { NetEntityEventTypes } from "../../packets/netentityeventtypes";
import { Client } from "../client/client";
import { ClientEntity, setPosition, setSprite } from "../client/cliententity";
import { Message } from "../../packets/message";
import { MessageTypes } from "../../packets/messagetypes";

// Handle message based on the EntityEventType.
// Will need non-entity messages such as "CREATE_FIRE_BALL" with x,y,z location in Euler direction etc...
// EntityMessage should be renamed to NetMessage
// EntityEventTypes should renamed to NetEventTypes
// CREATE will now be CREATE_ENTITIES and so on...
export function processNetMessages(client: Client) {
    client.connection.onmessage = function(messageEvent: MessageEvent) {
        // const message: NetEntityMessage = JSON.parse(messageEvent.data);
        const message: Message = JSON.parse(messageEvent.data);
        console.log("boardhouse: back to front message");

        switch (message.messageType) {
            case MessageTypes.NET_ENTITY_MESSAGE:
                processNetEntityMessages(message as NetEntityMessage, client);
                break;
            // case MessageTypes.NET_EVENT_MESSAGE
        }
    }
}

function processNetEntityMessages(message: NetEntityMessage, client: Client) {
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
            clientEnt.netId = entData.netId;
            clientEnt.pos = setPosition(entData.pos.x, entData.pos.y, entData.pos.z);
            clientEnt.sprite = setSprite(entData.sprite.url, client.gameScene, client, entData.sprite.pixelRatio);
            clientEnt.pos.teleport = entData.pos.teleport;

            if (entData.anim) {
                // clientEnt.anim = setAnim(...);
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
                clientEnt.pos.loc.setX(entData.pos.x);
                clientEnt.pos.loc.setY(entData.pos.y);
                clientEnt.pos.teleport = entData.pos.teleport;
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