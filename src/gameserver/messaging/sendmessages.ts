import { Entity } from "../serverengine/entity";
import { NetEntityMessage } from "../../packets/netentitymessage";
import { NetEntityEventTypes } from "../../packets/netentityeventtypes";
import { Server } from "../serverengine/server";
import { MessageTypes } from "../../packets/messagetypes";
import { NetEventMessage } from "../../packets/neteventmessage";
import { NetEventTypes } from "../../packets/neteventtypes";
import { EntityData } from "../../packets/entitydata";
import { BaseState } from "../serverengine/basestate";
import { NetWorldEventTypes, NetWorldMessage, WorldTypes } from "../../packets/networldmessage";
import { WorldLevelData } from "../../packets/worldleveldata";

export function sendCreateEntitiesMessage(ents: Entity[], server: Server, worldType: WorldTypes) {
    let message: NetEntityMessage = {
        messageType: MessageTypes.NET_ENTITY_MESSAGE,
        eventType: NetEntityEventTypes.CREATE,
        worldType: worldType,
        data: [],
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

            message.data.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

export function sendUpdateEntitiesMessage(ents: Entity[], server: Server, worldType: WorldTypes) {
    let message: NetEntityMessage = {
        messageType: MessageTypes.NET_ENTITY_MESSAGE,
        eventType: NetEntityEventTypes.UPDATE,
        worldType: worldType,
        data: [],
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

            message.data.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });

    server.entityChangeList = [];
}

export function sendDestroyEntitiesMessage(ents: Entity[], server: Server, worldEngine: BaseState) {
    let message: NetEntityMessage = {
        messageType: MessageTypes.NET_ENTITY_MESSAGE,
        eventType: NetEntityEventTypes.DESTROY,
        worldType: worldEngine.worldType,
        data: [],
    }

    ents.forEach(ent => {
        // Remove entity from backend entity list.
        worldEngine.removeEntity(ent);
        
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
export function sendNetEventMessage(ents: Entity[], server: Server, netEventType: NetEventTypes, worldType: WorldTypes) {
    let message: NetEventMessage = {
        messageType: MessageTypes.NET_EVENT_MESSAGE,
        eventType: netEventType,
        worldType: worldType,
        data: [],
    }

    // All ent data is purely for rendering attack animation purposes.
    // One ent may be hitbox data for example (optionally render temporarily on front end for testing purposes)
    ents.forEach(ent => {
        if (ent.pos && ent.sprite) {
            const entData: EntityData = {
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
                    teleport: true, // Set to true to mitigate lerping for fresh renders.
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

//#region Send Net World Messages
export function sendLoadWorldMessage(server: Server, worldLevelData: WorldLevelData) {
    let message: NetWorldMessage = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.LOAD_WORLD,
        worldType: worldLevelData.worldType, // unnecessary
        data: worldLevelData,
    }

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}
//#endregion