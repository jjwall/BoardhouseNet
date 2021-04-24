import { ClientMessage } from "../../packets/clientmessage";
import { EntityMessage } from "../../packets/entitymessage";
import { EntityEventTypes } from "../../packets/entityeventtypes";
import { Client } from "../client/client";
import { ClientEntity, setPosition, setSprite } from "./../client/cliententity";

export function messageHandlerSystem(client: Client) {
    client.connection.onmessage = function(messageEvent: MessageEvent) {
        const message: EntityMessage = JSON.parse(messageEvent.data);
        console.log("boardhouse: back to front message");

        if (message.eventType === EntityEventTypes.CREATE) {
            createEntity(message, client);
        }

        if (message.eventType === EntityEventTypes.UPDATE) {
            updateEntity(message, client);
        }

        if (message.eventType === EntityEventTypes.DESTROY) {
            destroyEntity(message, client);
        }
    }
}

// TODO: implement this!! // -> i.e. create or update a front end version of an entity
// Note: this function will get called a bunch when a player or spectator first joins (to set up all the front-end entities)
// netId, pos, sprite are all REQUIRED - anim is optional
function createEntity(message: EntityMessage, client: Client) {
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

            if (entData.anim) {
                // clientEnt.anim = setAnim(...);
            }

            client.entityList.push(clientEnt);
            client.NetIdToEntityMap[entData.netId] = clientEnt;
        }
    });
}

function updateEntity(message: EntityMessage, client: Client) {
    message.data.forEach(entData => {
        if (client.NetIdToEntityMap[entData.netId]) {
            let clientEnt = client.NetIdToEntityMap[entData.netId];

            if (clientEnt.sprite && clientEnt.pos) {
                clientEnt.pos.loc.setX(entData.pos.x);
                clientEnt.pos.loc.setY(entData.pos.y);
            }
    
            // if (clientEnt.anim) {
                // clientEnt.anim = setAnim(...);
            // }
        }
    });
}

// Destroy a front end version of an entity.
function destroyEntity(message: EntityMessage, client: Client) {
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