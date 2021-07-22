import { NetMessageLoadWorld, NetMessagePlayerWorldTransition, NetMessageUnloadWorld, NetWorldEventTypes } from "../../packets/networldmessage";
import { Entity } from "../serverengine/entity";
import { NetEntityEventTypes, NetMessageCreateEntities, NetMessageDestroyEntities, NetMessageUpdateEntities } from "../../packets/netentitymessage";
import { Server } from "../serverengine/server";
import { MessageTypes } from "../../packets/message";
import { EntityData } from "../../packets/entitydata";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { WorldLevelData } from "../../packets/worldleveldata";
import { WorldTypes } from "../../packets/worldtypes";
import { MyWebSocket } from "../serverengine/setupgameserver";
import { WorldTransitionData } from "../../packets/worldtransitiondata";
import { NetActionEventTypes, NetActionMessage } from "../../packets/netactionmessage";

export function sendCreateEntitiesMessage(ents: Entity[], server: Server, worldType: WorldTypes) {
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

            message.data.ents.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

export function sendUpdateEntitiesMessage(ents: Entity[], server: Server, worldType: WorldTypes) {
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

export function sendDestroyEntitiesMessage(ents: Entity[], server: Server, worldEngine: BaseWorldEngine) {
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

//#region Send Net Event Messages
// TODO: Can have a generic file called "netevents.ts" and the methods just set up the data needed to be passed into this method
// i.e. look at the attack in core systems, all that could be in a method called "sendPlayerAttackNetEventMessage" or something...
// This function assumes entity data is needed to be sent for generic "sendNetEventMessage" method - in the future we may want 
// more functionality, for example one net event might be "SwitchToEndGameScreen" or something and no ent data would need to be sent
export function broadcastNetActionMessage(ents: Entity[], server: Server, netEventType: NetActionEventTypes, worldType: WorldTypes) {
    // NetMessagePlayerAttackDisplay...

    const message: NetActionMessage = {
        messageType: MessageTypes.NET_ACTION_MESSAGE,
        eventType: netEventType,
        data: {
            ents: [],
            worldType: worldType,
        }
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

            message.data.ents.push(entData);
        }
    });

    server.boardhouseServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}
//#endregion

//#region Send Net World Messages
export function sendLoadWorldMessage(server: Server, worldLevelData: WorldLevelData, clientId: string) {
    const message: NetMessageLoadWorld = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.LOAD_WORLD,
        data: worldLevelData,
    }

    server.boardhouseServer.clients.forEach(client => {
        const myClient = client as MyWebSocket;

        if (myClient.clientId === clientId) {
            console.log(`(port: ${server.gameServerPort}): sending load world message to client with clientId = "${clientId}"`)
            client.send(JSON.stringify(message));
        }
    });
}

export function sendUnloadWorldMessage(server: Server, worldLevelData: WorldLevelData, clientId: string) {
    const message: NetMessageUnloadWorld = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.UNLOAD_WORLD,
    }

    server.boardhouseServer.clients.forEach(client => {
        const myClient = client as MyWebSocket;

        if (myClient.clientId === clientId) {
            console.log(`(port: ${server.gameServerPort}): sending unload world message to client with clientId = "${clientId}"`)
            client.send(JSON.stringify(message));
        }
    });
}

export function sendPlayerWorldTransitionMessage(server: Server, worldTransitionData: WorldTransitionData, clientId: string, worldToLoad: WorldTypes) {
    const message: NetMessagePlayerWorldTransition = {
        messageType: MessageTypes.NET_WORLD_MESSAGE,
        eventType: NetWorldEventTypes.PLAYER_WORLD_TRANSITION,
        data: worldTransitionData,
    }

    server.boardhouseServer.clients.forEach(client => {
        const myClient = client as MyWebSocket;

        if (myClient.clientId === clientId) {
            console.log(`(port: ${server.gameServerPort}): sending transition world message to client with clientId = "${clientId}"`)
            client.send(JSON.stringify(message));
        }
    });
}

export function sendSpectatorWorldTransitionMessage() {
    // ...
}
//#endregion