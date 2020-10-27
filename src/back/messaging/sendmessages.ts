import { Entity } from "../states/gameplay/entity";
import { IBoardhouseBack } from "../engine/interfaces";
import { EntityMessage } from "../../packets/entitymessage";
import { EntityEventTypes } from "../../packets/entityeventtypes";

export function sendCreateOrUpdateEntityMessage(ent: Entity, boardhouseBack: IBoardhouseBack) {
    if (ent.pos && ent.sprite && ent.anim) {
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