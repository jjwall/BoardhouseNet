import { necroBasicAttackAnim } from "../../modules/animations/animationdata/necrobasicattack";
import { broadcastDisplayPlayerAttackMessage } from "../messaging/sendnetactionmessages";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setPosition } from "../components/position";
import { Entity } from "../serverengine/entity";
import { swordAnim } from "../../modules/animations/animationdata/sword";

// Note: weird performance issues when updating position after setting within this method
export function basicSwordAttack(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    let swordRenders: Entity[] = [];
    let swordRender: Entity = new Entity();
    let offsetPosX = 0;
    let offsetPosY = 0;
    // swordRender.pos = { loc: undefined, dir: undefined, wrap: undefined, flipX: false }
    
    // setPosition(attackingEnt.pos.loc.x + attackPosOffset, attackingEnt.pos.loc.y, attackingEnt.pos.loc.z + 1);

    if (attackingEnt.pos.flipX) {
        offsetPosX = -100;
        swordRender.pos = setPosition(attackingEnt.pos.loc.x + offsetPosX, attackingEnt.pos.loc.y, attackingEnt.pos.loc.z + 1);
        swordRender.pos.flipX = true
    }
    else {
        offsetPosX = 100;
        swordRender.pos = setPosition(attackingEnt.pos.loc.x + offsetPosX, attackingEnt.pos.loc.y, attackingEnt.pos.loc.z + 1);
    }

    swordRender.sprite = { url: "./data/textures/basic_sword_attack001.png", pixelRatio: 8 };
    swordRender.anim = { sequence: SequenceTypes.ATTACK, blob: swordAnim };
    swordRenders.push(swordRender);
    broadcastDisplayPlayerAttackMessage(attackingEnt, swordRenders, 40, true, offsetPosX, offsetPosY, worldEngine.server, worldEngine.worldType);
}