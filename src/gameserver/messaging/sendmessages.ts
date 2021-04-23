import { Entity } from "../states/gameplay/entity";
import { EntityMessage } from "../../packets/entitymessage";
import { EntityEventTypes } from "../../packets/entityeventtypes";
import { last } from "../server/helpers";
import { Server } from "./../server/server";

export function sendCreateEntityMessage(ent: Entity, server: Server) {
    if (ent.pos && ent.sprite) {
        const entData: EntityData = {
            netId: ent.netId,
            pos: ent.pos,
            sprite: ent.sprite,
            anim: ent.anim
        }

        server.boardhouseServer.clients.forEach(client => {
            const message: EntityMessage = {
                eventType: EntityEventTypes.CREATE,
                data: entData
            }

            client.send(JSON.stringify(message));
        });
    }
}

export function sendUpdateEntityMessage(ent: Entity, server: Server) {
    if (ent.pos && ent.sprite) {
        const entData: EntityData = {
            netId: ent.netId,
            pos: ent.pos,
            sprite: ent.sprite,
            anim: ent.anim
        }

        server.boardhouseServer.clients.forEach(client => {
            const message: EntityMessage = {
                eventType: EntityEventTypes.UPDATE,
                data: entData
            }

            client.send(JSON.stringify(message));
        });
    }
}

/**
 * This function should be called when a player or specator joins the match so they can
 * get all relevant entity data sent to their clients
 * A modified function like this may be used in a game that has scene transitions - where only the relevant
 * entity data of a certain scene may need to get sent over instead
 * @param ents 
 * @param server 
 */
export function sendCreateAllEntitiesMessages(ents: Entity[], server: Server) {
    ents.forEach(ent => {
        sendCreateEntityMessage(ent, server);
    });
}

/**
 * Update to be called after a tick of engine.
 * 
 * PROBABLY NOT THE MOST EFFICIENT WAY TO DO THIS - BUT WORKS FOR NOW
 * @param ents 
 * @param server 
 */
export function sendUpdateAllEntitiesMessages(ents: Entity[], server: Server) {
    ents.forEach(ent => {
        sendUpdateEntityMessage(ent, server);
    });
}

export function sendDestroyEntityMessage(ent: Entity, server: Server) {
    // remove entity from backend entity list:
    server.currentState.removeEntity(ent);
    
    if (ent.netId) {
        const entData: EntityData = { // make optional params
            netId: ent.netId,
            pos: ent.pos,
            sprite: ent.sprite,
            anim: ent.anim
        }

        server.boardhouseServer.clients.forEach(client => {
            const message: EntityMessage = {
                eventType: EntityEventTypes.DESTROY,
                data: entData
            }

            client.send(JSON.stringify(message));
        });
    }
}