import { ClientMessage } from "../../packets/clientmessage";
import { EntityMessage } from "../../packets/entitymessage";
import { EntityEventTypes } from "../../packets/entityeventtypes";
import { Client } from "../client/client";
import { ClientEntity, setPosition, setSprite } from "./../client/cliententity";

export function messageHandlerSystem(client: Client) {
    client.connection.onmessage = function(messageEvent: MessageEvent) {
        const message: EntityMessage = JSON.parse(messageEvent.data);
        console.log("boardhouse: back to front message");

        if (message.eventType === EntityEventTypes.CREATE_OR_UPDATE) {
            createOrUpdateEntity(message, client);
        }
    }
}

// TODO: implement this!! // -> i.e. create or update a front end version of an entity
// Note: this function will get called a bunch when a player or spectator first joins (to set up all the front-end entities)
function createOrUpdateEntity(message: EntityMessage, client: Client) {
    console.log("create entity front");
    console.log(message.data);

    // Create a front-end entity for the client that will represent a back-end entity.
    // Dummy data (will get real data from message.data)
    let clientEnt = new ClientEntity();
    clientEnt.pos = setPosition(150, 150, 5);
    clientEnt.sprite = setSprite("./data/textures/msknight.png", client.gameScene, client);
    client.entityList.push(clientEnt);
}

// TODO: implement!! // -> i.e. destroy a front end version of an entity
function destroyEntity() {

}