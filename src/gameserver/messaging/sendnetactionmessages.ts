import { NetActionEventTypes, NetActionMessage } from "../../packets/netactionmessage";
import { EntityData } from "../../packets/entitydata";
import { WorldTypes } from "../../packets/worldtypes";
import { MessageTypes } from "../../packets/message";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";

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