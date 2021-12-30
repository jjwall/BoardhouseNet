import { necroBasicAttackAnim } from "../../modules/animations/animationdata/necrobasicattack";
import { broadcastDisplayPlayerAttackMessage } from "../messaging/sendnetactionmessages";
import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setPosition } from "../components/position";
import { Entity } from "../serverengine/entity";
import { swordAnim } from "../../modules/animations/animationdata/sword";
import { setTimer } from "../components/timer";
import { HitboxTypes, setHitbox } from "../components/hitbox";

// Note: weird performance issues when updating position after setting within this method
export function basicSwordAttack(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    let swordAttack: Entity = new Entity();
    let offsetPosX = 0;
    let offsetPosY = 0;

    if (attackingEnt.pos.flipX) {
        offsetPosX = -150;
        offsetPosY = 0;
        swordAttack.hitbox = setHitbox(HitboxTypes.PLAYER_SWORD_ATTACK, [HitboxTypes.ENEMY], 200, 200, offsetPosX, offsetPosY);
        swordAttack.pos = setPosition(0, 0, 1);
        swordAttack.pos.flipX = true
    }
    else {
        offsetPosX = 150;
        offsetPosY = 0;
        swordAttack.hitbox = setHitbox(HitboxTypes.PLAYER_SWORD_ATTACK, [HitboxTypes.ENEMY], 200, 200, offsetPosX, offsetPosY);
        swordAttack.pos = setPosition(0, 0, 1);
    }

    swordAttack.sprite = { url: "./data/textures/basic_sword_attack001.png", pixelRatio: 8 };
    swordAttack.anim = { sequence: SequenceTypes.ATTACK, blob: swordAnim };
    swordAttack.parent = attackingEnt;
    swordAttack.timer = setTimer(15, () => {
        broadcastDestroyEntitiesMessage([swordAttack], worldEngine.server, worldEngine);
    });
    worldEngine.registerEntity(swordAttack, worldEngine.server);
    broadcastCreateEntitiesMessage([swordAttack], worldEngine.server, worldEngine.worldType);

    // broadcast update message here to display player attack animation?
}