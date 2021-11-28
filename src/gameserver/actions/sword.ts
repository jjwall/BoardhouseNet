import { necroBasicAttackAnim } from "../../modules/animations/animationdata/necrobasicattack";
import { broadcastDisplayPlayerAttackMessage } from "../messaging/sendnetactionmessages";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setPosition } from "../components/position";
import { Entity } from "../serverengine/entity";

export function basicSwordAttack(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    let attackPosOffset = 100;

    if (attackingEnt.pos.flipX)
        attackPosOffset -= 200;

    let attackEnts: Entity[] = [];
    let attackEnt: Entity = new Entity();
    attackEnt.pos = setPosition(attackingEnt.pos.loc.x + attackPosOffset, attackingEnt.pos.loc.y, attackingEnt.pos.loc.z + 1);
    attackEnt.sprite = { url: "./data/textures/unholyblast1.png", pixelRatio: 8 };
    attackEnt.anim = { sequence: SequenceTypes .ATTACK, blob: necroBasicAttackAnim };
    attackEnts.push(attackEnt);
    broadcastDisplayPlayerAttackMessage(attackEnts, worldEngine.server, worldEngine.worldType);
}