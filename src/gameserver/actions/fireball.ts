import { Vector3 } from "three";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { getWorldPosition, setPosition } from "../components/position";
import { setVelocity } from "../components/velocity";
import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";

export function fireballPress(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    if (attackingEnt.movement) {
        attackingEnt.movement.actionOverride = fireballHold;
    }
}

export function fireballHold(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    if (attackingEnt.anim) {
        attackingEnt.anim.sequence = SequenceTypes.ATTACK;
    }

    if (!attackingEnt.actionReticle) {
        let magicReticle = new Entity();
        let offsetPosX = 0;
        let offsetPosY = 0;
        if (attackingEnt.pos.flipX) {
            offsetPosX = -150;
        }
        else {
            offsetPosX = 150;
        }
        magicReticle.pos = setPosition(offsetPosX, offsetPosY, 4, new Vector3(1, -1, 0));
        magicReticle.sprite = { url: "./data/textures/magic_circle.png", pixelRatio: 0.25 };

        // Set parent Since we're setting position relative to attacking ent.
        magicReticle.parent = attackingEnt;

        // Set action reticle reference.
        attackingEnt.actionReticle = magicReticle;

        worldEngine.registerEntity(magicReticle, worldEngine.server);
        broadcastCreateEntitiesMessage([magicReticle], worldEngine.server, worldEngine.worldType);
    }
    else {
        if (attackingEnt.movement) {
            const reticleWorldPos = getWorldPosition(attackingEnt.actionReticle);
            const scalar = 150;
            let angle = Math.atan2(reticleWorldPos.y - attackingEnt.pos.loc.y, reticleWorldPos.x - attackingEnt.pos.loc.x);
            if (attackingEnt.movement.right) {
                attackingEnt.pos.flipX = false;
                angle -= Math.PI / 16;
                attackingEnt.actionReticle.pos.loc = new Vector3(Math.cos(angle) * scalar, Math.sin(angle) * scalar, 5);
            }
    
            if (attackingEnt.movement.left) {
                attackingEnt.pos.flipX = true;
                angle += Math.PI / 16;
                attackingEnt.actionReticle.pos.loc = new Vector3(Math.cos(angle) * scalar, Math.sin(angle) * scalar, 5);
            }
    
            // Update attacking ent. -> bug when anims stop -> just need to reset to idle?
            worldEngine.server.entityChangeList.push(attackingEnt);
            worldEngine.server.entityChangeList.push(attackingEnt?.actionReticle);
        }
    }
}

export function fireballRelease(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    console.log("BLAM! FIREBALL!");
    // get direction from reticle to attacking ent...
    if (attackingEnt.movement) {
        attackingEnt.movement.actionOverride = undefined;
    }

    // if (attackingEnt?.movement?.actionOverride)

    if (attackingEnt?.actionReticle) {
        broadcastDestroyEntitiesMessage([attackingEnt.actionReticle], worldEngine.server, worldEngine);
        attackingEnt.actionReticle.parent = undefined;
        attackingEnt.actionReticle = undefined;
    }
}