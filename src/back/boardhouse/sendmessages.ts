import { Entity } from "./entity";
import { IBoardhouseBack } from "./interfaces";
import { EntityMessage } from "../../packets/entitymessage";
import { EntityEventTypes } from "../../packets/entityeventtypes";

export function sendCreateeOrUpdateEntityMessage(ent: Entity, boardhouseBack: IBoardhouseBack) {
    boardhouseBack.boardhouseServer.clients.forEach(client => {
        const message: EntityMessage = {
            eventType: EntityEventTypes.CREATE_OR_UPDATE,
            data: ent
        }

        client.send(JSON.stringify(message));
    });

    boardhouseBack.netIdToEntityMap[boardhouseBack.currentNetId] = ent;
}