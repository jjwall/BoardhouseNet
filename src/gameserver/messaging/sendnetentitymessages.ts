import { NetEntityEventTypes, NetMessageCreateEntities, NetMessageDestroyEntities, NetMessageUpdateEntities } from "../../packets/messages/netentitymessage";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { EntityData } from "../../packets/data/entitydata";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { MessageTypes } from "../../packets/messages/message";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";

export function broadcastCreateEntitiesMessage(ents: Entity[], server: Server, worldType: WorldTypes) {
    let message: NetMessageCreateEntities = {
        messageType: MessageTypes.NET_ENTITY_MESSAGE,
        eventType: NetEntityEventTypes.CREATE,
        data: {
            worldType: worldType,
            ents: [],
        },
    }

    ents.forEach(ent => {
        if (ent.pos && ent.sprite) {
            const entData: EntityData = {
                netId: ent.netId,
                pos: {
                    loc: {
                        x: ent.pos.loc.x,
                        y: ent.pos.loc.y,
                        z: ent.pos.loc.z,
                    },
                    dir: {
                        x: ent.pos.dir.x,
                        y: ent.pos.dir.y,
                        z: ent.pos.dir.z,
                    },
                    flipX: ent.pos.flipX,
                    teleport: true, // Set to true to mitigate lerping for newly created ents.
                },
                sprite: ent.sprite,
                anim: ent.anim,
                player: ent.player,
            }

            if (ent.hitbox) {
                entData.hitbox = {
                    height: ent.hitbox.height,
                    width: ent.hitbox.width,
                    offsetX: ent.hitbox.offsetX,
                    offsetY: ent.hitbox.offsetY,
                }
            }

            if (ent.parent) {
                entData.parentNetId = ent.parent.netId
            }

            message.data.ents.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

export function broadcastUpdateEntitiesMessage(ents: Entity[], server: Server, worldType: WorldTypes) {
    let message: NetMessageUpdateEntities = {
        messageType: MessageTypes.NET_ENTITY_MESSAGE,
        eventType: NetEntityEventTypes.UPDATE,
        data: {
            worldType: worldType,
            ents: [],
        },
    }

    ents.forEach(ent => {
        if (ent.pos && ent.sprite) {
            const entData: EntityData = {
                netId: ent.netId,
                pos: {
                    loc: {
                        x: ent.pos.loc.x,
                        y: ent.pos.loc.y,
                        z: ent.pos.loc.z,
                    },
                    dir: {
                        x: ent.pos.dir.x,
                        y: ent.pos.dir.y,
                        z: ent.pos.dir.z,
                    },
                    flipX: ent.pos.flipX,
                    teleport: false, // TODO: will need to get more sophisticated here - a teleport skill that needs updating would require this to be true.
                },
                sprite: ent.sprite,
                anim: ent.anim,
                player: ent.player,
            }

            message.data.ents.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });

    server.entityChangeList = [];
}

export function broadcastDestroyEntitiesMessage(ents: Entity[], server: Server, worldEngine: BaseWorldEngine) {
    let message: NetMessageDestroyEntities = {
        messageType: MessageTypes.NET_ENTITY_MESSAGE,
        eventType: NetEntityEventTypes.DESTROY,
        data: {
            worldType: worldEngine.worldType,
            ents: [],
        },
    }

    ents.forEach(ent => {
        // Remove entity from backend entity list.
        worldEngine.removeEntity(ent);
        
        if (ent.netId) {
            const entData: EntityData = {
                netId: ent.netId,
            }

            message.data.ents.push(entData);
        }
    });
    
    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}