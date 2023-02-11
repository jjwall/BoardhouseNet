import { initializeSkill, SkillSlotsComponent } from "../components/skillslots";
import { armatureAnim } from "../../modules/animations/animationdata/armature";
import { bowAndArrowPress, bowAndArrowRelease } from "../actions/bowandarrow";
import { rangerAnim } from "../../modules/animations/animationdata/ranger";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { presetInventory } from "../../../database/preset_inventory";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { PlayerStates, setPlayer } from "../components/player";
import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setMovement } from "../components/movement";
import { basicSwordAttack } from "../actions/sword";
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";

export function createArcher(server: Server, worldEngine: BaseWorldEngine, clientId: string, pos: PositionComponent): Entity {
    let archer = new Entity();
    archer.player = setPlayer(clientId, PlayerStates.UNLOADED, PlayerClassTypes.ARCHER, presetInventory);
    archer.pos = pos;
    archer.vel = setVelocity(15, 0.5);
    archer.sprite = { url: "./data/textures/ranger/idle/Heroine_ranger_idle_00.png", pixelRatio: 1 };
    archer.anim = { sequence: SequenceTypes.IDLE, blob: rangerAnim };
    archer.movement = setMovement();
    archer.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY, HitboxTypes.ITEM_DROP], 50, 50, 0, -50);
    archer.skillSlots = new SkillSlotsComponent()
    archer.skillSlots.setSkillOne(initializeSkill(0, 10, bowAndArrowPress, bowAndArrowRelease, false));
    // archer.skillSlots.setSkillOne(initializeSkill(20, 20, () => { console.log("skilllling")}))
    // archer.skillSlots.setSkillOne(initializeSkill(6, 20, undefined, basicSwordAttack))

    worldEngine.registerEntity(archer, server);

    return archer;
}