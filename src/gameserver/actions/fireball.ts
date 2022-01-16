import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { actionReticleAnim } from "../../modules/animations/animationdata/actionreticle";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { getWorldPosition, setPosition } from "../components/position";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setVelocity } from "../components/velocity";
import { Entity } from "../serverengine/entity";
import { setTimer } from "../components/timer";
import { Vector3 } from "three";

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
        magicReticle.pos = setPosition(offsetPosX, offsetPosY, 5);
        magicReticle.sprite = { url: "./data/textures/action_reticle001.png", pixelRatio: 8 };
        magicReticle.anim = { sequence: SequenceTypes.IDLE, blob: actionReticleAnim };

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

// Can spam - fix with cooldown.
export function fireballRelease(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    if (attackingEnt?.actionReticle) {
        // Get angle of reticle to player char.
        const reticleWorldPos = getWorldPosition(attackingEnt.actionReticle);
        const angle = Math.atan2(reticleWorldPos.y - attackingEnt.pos.loc.y, reticleWorldPos.x - attackingEnt.pos.loc.x);
        const fireballDirection = new Vector3(Math.cos(angle), Math.sin(angle), 5);

        // Create fireball and launch in direction of desired angle.
        let fireball = new Entity();
        fireball.pos = setPosition(attackingEnt.pos.loc.x, attackingEnt.pos.loc.y, 5);
        fireball.sprite = { url: "./data/textures/standardbullet.png", pixelRatio: 4 };
        fireball.vel = setVelocity(15, 0);
        fireball.vel.positional.add(fireballDirection.multiplyScalar(fireball.vel.acceleration));
        fireball.timer = setTimer(100, () => {
            broadcastDestroyEntitiesMessage([fireball], worldEngine.server, worldEngine);
        });

        // Register fireball ent and broadcast creation event.
        worldEngine.registerEntity(fireball, worldEngine.server);
        broadcastCreateEntitiesMessage([fireball], worldEngine.server, worldEngine.worldType);

        // Destroy reticle and free up reference.
        broadcastDestroyEntitiesMessage([attackingEnt.actionReticle], worldEngine.server, worldEngine);
        attackingEnt.actionReticle.parent = undefined;
        attackingEnt.actionReticle = undefined;
    }

    // Set character animation back to idle once Fireball has been cast.
    if (attackingEnt.anim) {
        attackingEnt.anim.sequence = SequenceTypes.IDLE;
    }

    // Free up reference to action override so player can resume movement.
    if (attackingEnt?.movement?.actionOverride) {
        attackingEnt.movement.actionOverride = undefined;
    }
}