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
    console.log("create entity front");
    console.log(message.data);

    // Create a front-end entity for the client that will represent a back-end entity.
    // Don't create the ent twice if it had already been created.
    if (!client.NetIdToEntityMap[message.data.netId]) {
        let clientEnt = new ClientEntity();
        clientEnt.netId = message.data.netId;
        clientEnt.pos = setPosition(message.data.pos.x, message.data.pos.y, message.data.pos.z);
        clientEnt.sprite = setSprite(message.data.sprite.url, client.gameScene, client, message.data.sprite.pixelRatio);

        if (message.data.anim) {
            // clientEnt.anim = setAnim(...);
        }

        client.entityList.push(clientEnt);
        client.NetIdToEntityMap[message.data.netId] = clientEnt;
    }
}

// VERY INEFFECIENT
// NEED TO MAP NETID TO ENTS
// NEET TO HAVE A CHANGE LIST SO UPDATING ONLY HAPPENS IN BULK AFTER ONE GAME TICK
function updateEntity(message: EntityMessage, client: Client) {
    let clientEnt = client.NetIdToEntityMap[message.data.netId];

    if (clientEnt.sprite && clientEnt.pos) {
        clientEnt.pos.loc.setX(message.data.pos.x);
        clientEnt.pos.loc.setY(message.data.pos.y);
    }
}

// TODO: implement!! // -> i.e. destroy a front end version of an entity
function destroyEntity(message: EntityMessage, client: Client) {
    console.log("destroy entity front");
    const entToDestroy = client.NetIdToEntityMap[message.data.netId];

    console.log(client.entityList);
    // Remove from entityList.
    if (client.entityList.indexOf(entToDestroy) !== -1) {
        client.entityList.splice(client.entityList.indexOf(entToDestroy), 1);
    }
    console.log("removing ent from entity list");
    console.log(client.entityList);

    // Remove from NetId to Entity map.
    delete client.NetIdToEntityMap[message.data.netId];

    // Remove sprite from scene.
    if (entToDestroy.sprite) {
        client.gameScene.remove(entToDestroy.sprite);
    }
}