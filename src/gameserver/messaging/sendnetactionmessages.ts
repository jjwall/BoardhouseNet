import { NetActionEventTypes, NetMessagePlayerAttackDisplay } from "../../packets/messages/netactionmessage";
import { MessageTypes } from "../../packets/messages/message";
import { EntityData } from "../../packets/data/entitydata";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";

// TODO: Can have a generic file called "netevents.ts" and the methods just set up the data needed to be passed into this method
// i.e. look at the attack in core systems, all that could be in a method called "sendPlayerAttackNetEventMessage" or something...
// This function assumes entity data is needed to be sent for generic "sendNetEventMessage" method - in the future we may want 
// more functionality, for example one net event might be "SwitchToEndGameScreen" or something and no ent data would need to be sent


// New TODO: should refactor this to be named "broadcastRenderPlayerSkillMessage"
// -> clean up Message interface name and data
// -> obviously shouldn't have 100 parameters here
// -> can refer to idea for param obj from basic action
// -> since this method is becoming the original idea for "generically creating an action"
// -> method in /actions directory will always be calling this
// Reconsider sening list of Ents here
// -> Do we need ents?
// -> Can we just use special render data instead? Does it matter?

// UPDATE: This method and all of net action messaging systems are likely deprecated in lieu of using
// existing entity methods and ent data, instead of a brand new set of "client render" data
// This method was once consumed in the basicsSwordAttack method like this:
// broadcastDisplayPlayerAttackMessage(attackingEnt, swordRenders, 40, true, offsetPosX, offsetPosY, worldEngine.server, worldEngine.worldType);
export function broadcastDisplayPlayerAttackMessage(entDoingAction: Entity, ents: Entity[], renderDuration: number, renderTracksCaster: boolean, offsetPosX: number, offsetPosY: number, server: Server, worldType: WorldTypes) {
    // NetMessagePlayerAttackDisplay...

    const message: NetMessagePlayerAttackDisplay = {
        messageType: MessageTypes.NET_ACTION_MESSAGE,
        eventType: NetActionEventTypes.PLAYER_ATTACK_ANIM_DISPLAY,
        data: {
            ents: [],
            worldType: worldType,
            entDoingActionNetId: entDoingAction.netId,
            renderDuration: renderDuration,
            renderTracksCaster: renderTracksCaster,
            offsetPosX: offsetPosX,
            offsetPosY: offsetPosY,
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