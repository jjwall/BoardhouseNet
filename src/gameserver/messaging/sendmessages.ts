import { Entity } from "../states/gameplay/entity";
import { EntityMessage } from "../../packets/entitymessage";
import { EntityEventTypes } from "../../packets/entityeventtypes";
import { Server } from "./../server/server";

export function sendCreateEntitiesMessage(ents: Entity[], server: Server) {
    let message: EntityMessage = {
        eventType: EntityEventTypes.CREATE,
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
                    teleport: true,
                },
                sprite: ent.sprite,
                anim: ent.anim
            }

            message.data.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

export function sendUpdateEntitiesMessage(ents: Entity[], server: Server) {
    let message: EntityMessage = {
        eventType: EntityEventTypes.UPDATE,
        data: [],
    }

    ents.forEach(ent => {
        if (ent.pos && ent.sprite) {
            const entData: EntityData = {
                netId: ent.netId,
                pos: ent.pos,
                sprite: ent.sprite,
                anim: ent.anim
            }

            message.data.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });

    server.entityChangeList = [];
}

/**
 * This function should be called when a player or specator joins the match so they can
 * get all relevant entity data sent to their clients
 * A modified function like this may be used in a game that has scene transitions - where only the relevant
 * entity data of a certain scene may need to get sent over instead
 * @param ents 
 * @param server 
 */
// export function sendCreateAllEntitiesMessages(ents: Entity[], server: Server) {
//     ents.forEach(ent => {
//         sendCreateEntityMessage(ent, server);
//     });
// }

/**
 * Update to be called after a tick of engine.
 * 
 * PROBABLY NOT THE MOST EFFICIENT WAY TO DO THIS - BUT WORKS FOR NOW
 * @param ents 
 * @param server 
 */
// export function sendUpdateAllEntitiesMessages(ents: Entity[], server: Server) {
//     ents.forEach(ent => {
//         sendUpdateEntityMessage(ent, server);
//     });
// }

export function sendDestroyEntitiesMessage(ents: Entity[], server: Server) {
    let message: EntityMessage = {
        eventType: EntityEventTypes.DESTROY,
        data: [],
    }

    ents.forEach(ent => {
        // remove entity from backend entity list:
        server.currentState.removeEntity(ent);
        
        if (ent.netId) {
            const entData: EntityData = { // make optional params
                netId: ent.netId,
                pos: ent.pos,
                sprite: ent.sprite,
                anim: ent.anim
            }

            message.data.push(entData);
        }
    });
    
    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}