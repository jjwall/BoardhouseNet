import { initializeSkill, SkillSlotsComponent } from "../components/skillslots";
import { armatureAnim } from "../../modules/animations/animationdata/armature";
import { bowAndArrowPress, bowAndArrowRelease } from "../actions/bowandarrow";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setMovement } from "../components/movement";
import { PlayerStates } from "../components/player";
import { basicSwordAttack } from "../actions/sword";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";

export function createArcher(server: Server, worldEngine: BaseWorldEngine, clientId: string, pos: PositionComponent): Entity {
    let archer = new Entity();
    archer.player = { id: clientId, state: PlayerStates.UNLOADED, class: PlayerClassTypes.ARCHER };
    archer.pos = pos;
    archer.vel = setVelocity(15, 0.5);
    archer.sprite = { url: "./data/textures/Armature_idle_00.png", pixelRatio: 1 };
    archer.anim = { sequence: SequenceTypes.IDLE, blob: armatureAnim };
    archer.movement = setMovement();
    archer.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY], 50, 50, 0, -50);
    archer.skillSlots = new SkillSlotsComponent()
    archer.skillSlots.setSkillOne(initializeSkill(0, 10, bowAndArrowPress, bowAndArrowRelease, false));
    // archer.skillSlots.setSkillOne(initializeSkill(20, 20, () => { console.log("skilllling")}))
    // archer.skillSlots.setSkillOne(initializeSkill(6, 20, undefined, basicSwordAttack))

    worldEngine.registerEntity(archer, server);

    return archer;
}