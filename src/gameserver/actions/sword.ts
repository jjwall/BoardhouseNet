import { necroBasicAttackAnim } from "../../modules/animations/animationdata/necrobasicattack";
import { broadcastDisplayPlayerAttackMessage } from "../messaging/sendnetactionmessages";
import { broadcastCreateEntitiesMessage } from "../messaging/sendnetentitymessages";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setPosition } from "../components/position";
import { Entity } from "../serverengine/entity";
import { swordAnim } from "../../modules/animations/animationdata/sword";

// Note: weird performance issues when updating position after setting within this method
export function basicSwordAttack(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    let swordRender: Entity = new Entity();
    let offsetPosX = 0;
    let offsetPosY = 0;

    if (attackingEnt.pos.flipX) {
        offsetPosX = 0;
        offsetPosY = 0;
        swordRender.pos = setPosition(offsetPosX, 0, 1);
        swordRender.pos.flipX = true
    }
    else {
        offsetPosX = 0;
        offsetPosY = 0;
        swordRender.pos = setPosition(offsetPosX, 0, 1);
    }

    swordRender.sprite = { url: "./data/textures/basic_sword_attack001.png", pixelRatio: 8 };
    swordRender.anim = { sequence: SequenceTypes.ATTACK, blob: swordAnim };
    swordRender.parent = attackingEnt;
    worldEngine.registerEntity(swordRender, worldEngine.server);
    broadcastCreateEntitiesMessage([swordRender], worldEngine.server, worldEngine.worldType);
    
    // broadcast update message here to display player attack animation?
}