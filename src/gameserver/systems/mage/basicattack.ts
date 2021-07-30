import { broadcastDisplayPlayerAttackMessage } from "../../messaging/sendnetactionmessages";
import { BaseWorldEngine } from "../../serverengine/baseworldengine";
import { setPosition } from "../../components/position";
import { Entity } from "../../serverengine/entity";

export function mageBasicAttack(mage: Entity, worldEngine: BaseWorldEngine) {
    if (mage.control.attackCooldownTicks <= 0) {
        let attackPosOffset = 100;

        if (mage.pos.flipX)
            attackPosOffset -= 200;

        let attackEnts: Entity[] = [];
        let attackEnt: Entity = new Entity();
        attackEnt.pos = setPosition(mage.pos.loc.x + attackPosOffset, mage.pos.loc.y, mage.pos.loc.z + 1);
        attackEnt.sprite = { url: "./data/textures/unholyblast1.png", pixelRatio: 8 };
        attackEnts.push(attackEnt);
        broadcastDisplayPlayerAttackMessage(attackEnts, worldEngine.server, worldEngine.worldType);
        
        // Start cooldown.
        mage.control.attackCooldownTicks = 60;
        mage.control.attack = false;
    }
    else {
        mage.control.attack = false;
    }
}