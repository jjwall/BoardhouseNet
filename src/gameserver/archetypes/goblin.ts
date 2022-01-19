import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { kenneyGoblinAnim } from "../../modules/animations/animationdata/kenneygoblin";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { HitboxTypes, setHitbox } from "../components/hitbox";
import { PositionComponent } from "../components/position"
import { Entity } from "../serverengine/entity";
import { setTimer } from "../components/timer";

export function createGoblin(worldEngine: BaseWorldEngine, pos: PositionComponent) {
    let goblin = new Entity();
    let hp = 50;
    goblin.pos = pos;
    goblin.pos.flipX = true;
    goblin.sprite = { url: "./data/textures/kenney_goblin001.png", pixelRatio: 4 };
    goblin.anim = { sequence: SequenceTypes.WALK, blob: kenneyGoblinAnim };
    goblin.hitbox = setHitbox(HitboxTypes.ENEMY, [HitboxTypes.PLAYER_SWORD_ATTACK, HitboxTypes.PLAYER_FIREBALL], 50, 50, 0, -50);
    goblin.hitbox.onHit = (goblin, other, manifold) => {
        if (other.hitbox.collideType === HitboxTypes.PLAYER_SWORD_ATTACK) {
            hp--;
            
            if (hp <= 0) {
                broadcastDestroyEntitiesMessage([goblin], worldEngine.server, worldEngine);
            }
        }
    }

    worldEngine.registerEntity(goblin, worldEngine.server);
    broadcastCreateEntitiesMessage([goblin], worldEngine.server, worldEngine.worldType);

    // hitbox / hurtbox

    // detection entity hit box

    // entity push (hit)box

    // Random walk space "home" (hit)box
}

function moveToRandomPoint(goblinEnt: Entity) {
    const randomTickAmount = 5;
    goblinEnt.timer = setTimer(randomTickAmount, () => {
        // move... ?
        moveToRandomPoint(goblinEnt);
    });
}