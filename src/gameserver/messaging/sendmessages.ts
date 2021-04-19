import { Entity } from "../states/gameplay/entity";
import { EntityMessage } from "../../packets/entitymessage";
import { EntityEventTypes } from "../../packets/entityeventtypes";
import { last } from "../server/helpers";
import { Server } from "./../server/server";

export function sendCreateOrUpdateEntityMessage(ent: Entity, server: Server) {
    if (ent.pos && ent.sprite) {
        const entData: EntityData = {
            netId: ent.netId,
            pos: ent.pos,
            sprite: ent.sprite,
            anim: ent.anim
        }

        server.boardhouseServer.clients.forEach(client => {
            const message: EntityMessage = {
                eventType: EntityEventTypes.CREATE_OR_UPDATE,
                data: entData
            }

            client.send(JSON.stringify(message));
        });
    }
}

// This function should be called when a player or specator joins the match so they can
// get all relevant entity data sent to their clients
// A modified function like this may be used in a game that has scene transitions - where only the relevant
// entity data of a certain scene may need to get sent over instead
export function sendCreateAllEntitiesMessages(ents: Entity[], server: Server) {
    ents.forEach(ent => {
        sendCreateOrUpdateEntityMessage(ent, server);
    });
}

export function sendDestroyEntityMessage(ent: Entity, server: Server) {
    // remove entity from backend entity list:
    last(server.stateStack).removeEntity(ent);
    
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