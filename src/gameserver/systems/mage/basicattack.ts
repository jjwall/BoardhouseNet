import { broadcastDisplayPlayerAttackMessage } from "../../messaging/sendnetactionmessages";
import { BaseWorldEngine } from "../../serverengine/baseworldengine";
import { setPosition } from "../../components/position";
import { Entity } from "../../serverengine/entity";
import { SequenceTypes } from "../../../modules/animations/sequencetypes";
import { necroBasicAttackAnim } from "../../../modules/animations/animationdata/necrobasicattack";

export function mageBasicAttack(mage: Entity, worldEngine: BaseWorldEngine) {
    if (mage.control.attackCooldownTicks <= 0) {
        let attackPosOffset = 100;

        if (mage.pos.flipX)
            attackPosOffset -= 200;

        let attackEnts: Entity[] = [];
        let attackEnt: Entity = new Entity();
        attackEnt.pos = setPosition(mage.pos.loc.x + attackPosOffset, mage.pos.loc.y, mage.pos.loc.z + 1);
        attackEnt.sprite = { url: "./data/textures/unholyblast1.png", pixelRatio: 8 };
        attackEnt.anim = { sequence: SequenceTypes.ATTACK, blob: necroBasicAttackAnim };
        attackEnts.push(attackEnt);
        broadcastDisplayPlayerAttackMessage(attackEnts, worldEngine.server, worldEngine.worldType);
        
        // Start attack cooldown.
        mage.control.attackCooldownTicks = 20;

        // Set number of studder ticks.
        mage.control.studderTicks = 5;
        mage.control.attack = false;
    }
    else {
        mage.control.attack = false;
    }
}