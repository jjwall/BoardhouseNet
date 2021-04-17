import { Entity } from "../states/gameplay/entity";
import { IBoardhouseBack } from "../engine/interfaces";
import { EntityMessage } from "../../packets/entitymessage";
import { EntityEventTypes } from "../../packets/entityeventtypes";
import { last } from "./../engine/helpers";

export function sendCreateOrUpdateEntityMessage(ent: Entity, boardhouseBack: IBoardhouseBack) {
    if (ent.pos && ent.sprite) {
        const entData: EntityData = {
            netId: ent.netId,
            pos: ent.pos,
            sprite: ent.sprite,
            anim: ent.anim
        }

        boardhouseBack.boardhouseServer.clients.forEach(client => {
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
export function sendCreateAllEntitiesMessages(ents: Entity[], boardhouseBack: IBoardhouseBack) {
    ents.forEach(ent => {
        sendCreateOrUpdateEntityMessage(ent, boardhouseBack);
    });
}

export function sendDestroyEntityMessage(ent: Entity, boardhouseBack: IBoardhouseBack) {
    // remove entity from backend entity list:
    last(boardhouseBack.stateStack).removeEntity(ent);
    
    if (ent.netId) {
        const entData: EntityData = { // make optional params
            netId: ent.netId,
            pos: ent.pos,
            sprite: ent.sprite,
            anim: ent.anim
        }

        boardhouseBack.boardhouseServer.clients.forEach(client => {
            const message: EntityMessage = {
                eventType: EntityEventTypes.DESTROY,
                data: entData
            }

            client.send(JSON.stringify(message));
        });
    }
}