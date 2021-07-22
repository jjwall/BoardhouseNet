import { NetEntityMessage, NetEntityEventTypes, NetMessageCreateEntities, NetMessageDestroyEntities, NetMessageUpdateEntities } from "../../packets/netentitymessage";
import { NetMessageLoadWorld, NetMessagePlayerWorldTransition, NetWorldMessage, NetWorldEventTypes } from "../../packets/networldmessage";
import { NetActionEventTypes, NetActionMessage, NetMessagePlayerAttackDisplay } from "../../packets/netactionmessage";
import { loadWorld, transitionPlayerClientToNewWorld, unloadWorld } from "./processnetworldmessages";
import { createEntities, destroyEntities, updateEntities } from "./processnetentitymessages";
import { renderPlayerAttackAnim } from "./processnetactionmessages";
import { Message, MessageTypes } from "../../packets/message";
import { Client } from "../clientengine/client";

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

function processNetActionMessage(message: NetActionMessage, client: Client) {
    switch (message.eventType) {
        case NetActionEventTypes.PLAYER_ATTACK_ANIM_DISPLAY:
            renderPlayerAttackAnim(message as NetMessagePlayerAttackDisplay, client);
            break;
        // case ...
    }
}

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