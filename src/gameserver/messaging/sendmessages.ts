import { Entity } from "../states/gameplay/entity";
import { NetEntityMessage } from "../../packets/netentitymessage";
import { NetEntityEventTypes } from "../../packets/netentityeventtypes";
import { Server } from "./../server/server";
import { MessageTypes } from "../../packets/messagetypes";
import { NetEventMessage } from "../../packets/neteventmessage";
import { NetEventTypes } from "../../packets/neteventtypes";

export function sendCreateEntitiesMessage(ents: Entity[], server: Server) {
    let message: NetEntityMessage = {
        messageType: MessageTypes.NET_ENTITY_MESSAGE,
        eventType: NetEntityEventTypes.CREATE,
        data: [],
    }

    ents.forEach(ent => {
        if (ent.pos && ent.sprite) {
            const entData: EntityData = {
                netId: ent.netId,
                pos: {
                    x: ent.pos.x,
                    y: ent.pos.y,
                    z: ent.pos.z,
                    teleport: true, // Set to true to mitigate lerping for newly created ents.
                },
                sprite: ent.sprite,
                anim: ent.anim,
                player: ent.player,
            }

            message.data.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

export function sendUpdateEntitiesMessage(ents: Entity[], server: Server) {
    let message: NetEntityMessage = {
        messageType: MessageTypes.NET_ENTITY_MESSAGE,
        eventType: NetEntityEventTypes.UPDATE,
        data: [],
    }

    ents.forEach(ent => {
        if (ent.pos && ent.sprite) {
            const entData: EntityData = {
                netId: ent.netId,
                pos: ent.pos,
                sprite: ent.sprite,
                anim: ent.anim,
                player: ent.player,
            }

            message.data.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });

    server.entityChangeList = [];
}

export function sendDestroyEntitiesMessage(ents: Entity[], server: Server) {
    let message: NetEntityMessage = {
        messageType: MessageTypes.NET_ENTITY_MESSAGE,
        eventType: NetEntityEventTypes.DESTROY,
        data: [],
    }

    ents.forEach(ent => {
        // Remove entity from backend entity list.
        server.currentState.removeEntity(ent);
        
        if (ent.netId) {
            const entData: EntityData = {
                netId: ent.netId,
            }

            message.data.push(entData);
        }
    });
    
    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

//#region Send Net Event Messages
// TODO: Can have a generic file called "netevents.ts" and the methods just set up the data needed to be passed into this method
// i.e. look at the attack in core systems, all that could be in a method called "sendPlayerAttackNetEventMessage" or something...
// This function assumes entity data is needed to be sent for generic "sendNetEventMessage" method - in the future we may want 
// more functionality, for example one net event might be "SwitchToEndGameScreen" or something and no ent data would need to be sent
export function sendNetEventMessage(ents: Entity[], server: Server, netEventType: NetEventTypes) {
    let message: NetEventMessage = {
        messageType: MessageTypes.NET_EVENT_MESSAGE,
        eventType: netEventType,
        data: [],
    }

    // All ent data is purely for rendering attack animation purposes.
    // One ent may be hitbox data for example (optionally render temporarily on front end for testing purposes)
    ents.forEach(ent => {
        if (ent.pos && ent.sprite) {
            const entData: EntityData = {
                pos: {
                    x: ent.pos.x,
                    y: ent.pos.y,
                    z: ent.pos.z,
                    teleport: true,
                },
                sprite: ent.sprite,
                anim: ent.anim,
            }

            message.data.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}
//#endregion