import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setPosition } from "../components/position";
import { Entity } from "../serverengine/entity";
import { swordAnim } from "../../modules/animations/animationdata/sword";
import { setTimer } from "../components/timer";
import { HitboxTypes, setHitbox } from "../components/hitbox";
import { kenneySwordAnim } from "../../modules/animations/animationdata/kenneysword";

// Note: weird performance issues when updating position after setting within this method
export function basicSwordAttack(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    let swordAttack: Entity = new Entity();
    let offsetPosX = 0;
    let offsetPosY = 0;

    if (attackingEnt.pos.flipX) {
        offsetPosX = -150;
        offsetPosY = 0;
        swordAttack.hitbox = setHitbox(HitboxTypes.PLAYER_SWORD_ATTACK, [HitboxTypes.ENEMY], 200, 200, offsetPosX, offsetPosY);
        swordAttack.pos = setPosition(0, 0, 6);
        swordAttack.pos.flipX = true
    }
    else {
        offsetPosX = 150;
        offsetPosY = 0;
        swordAttack.hitbox = setHitbox(HitboxTypes.PLAYER_SWORD_ATTACK, [HitboxTypes.ENEMY], 200, 200, offsetPosX, offsetPosY);
        swordAttack.pos = setPosition(0, 0, 6);
    }

    swordAttack.sprite = { url: "./assets/textures/items/kenney_sword001.png", pixelRatio: 1 };
    swordAttack.anim = { sequence: SequenceTypes.ATTACK, blob: kenneySwordAnim };

    // Set parent Since we're setting position relative to attacking ent.
    swordAttack.parent = attackingEnt;

    // Set attack sequence. Idle will be set in movement system after stutter ticks reaches 0.
    attackingEnt.anim.sequence = SequenceTypes.ATTACK
    worldEngine.server.entityChangeList.push(attackingEnt);

    // Action's duration.
    swordAttack.timer = setTimer(15, () => {
        broadcastDestroyEntitiesMessage([swordAttack], worldEngine.server, worldEngine);

        // Don't interrupt walking animation, otherwise set IDLE once action is ended.
        if (attackingEnt.anim.sequence !== SequenceTypes.WALK) {
            attackingEnt.anim.sequence = SequenceTypes.IDLE;
            worldEngine.server.entityChangeList.push(attackingEnt);
        }
    });

    worldEngine.registerEntity(swordAttack, worldEngine.server);
    broadcastCreateEntitiesMessage([swordAttack], worldEngine.server, worldEngine.worldType);
}