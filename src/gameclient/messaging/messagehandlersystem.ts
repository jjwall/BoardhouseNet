import { PlayerMessage } from "../../packets/playermessage";
import { EntityMessage } from "../../packets/entitymessage";
import { EntityEventTypes } from "../../packets/entityeventtypes";
import { Client } from "../client/clientstatemachine";

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
function createOrUpdateEntity(message: EntityMessage, client: Client) {
    console.log("create entity front");
    console.log(message.data);
}

// TODO: implement!! // -> i.e. destroy a front end version of an entity
function destroyEntity() {

}