import { initializeSkill, SkillSlotsComponent } from "../components/skillslots";
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
import { Entity } from "../serverengine/entity";
import { Server } from "../serverengine/server";

export function createRanger(server: Server, worldEngine: BaseWorldEngine, clientId: string, pos: PositionComponent): Entity {
    let ranger = new Entity();
    ranger.player = setPlayer(clientId, PlayerStates.UNLOADED, PlayerClassTypes.RANGER, presetInventory);
    ranger.pos = pos;
    ranger.vel = setVelocity(15, 0.5);
    ranger.sprite = { url: "./assets/textures/ranger/idle/Heroine_ranger_idle_00.png", pixelRatio: 1 };
    ranger.anim = { sequence: SequenceTypes.IDLE, blob: rangerAnim };
    ranger.movement = setMovement();
    ranger.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY, HitboxTypes.ITEM_DROP], 50, 50, 0, -50);
    ranger.skillSlots = new SkillSlotsComponent()
    ranger.skillSlots.setSkillOne(initializeSkill(0, 10, bowAndArrowPress, bowAndArrowRelease, false));
    // ranger.skillSlots.setSkillOne(initializeSkill(20, 20, () => { console.log("skilllling")}))
    // ranger.skillSlots.setSkillOne(initializeSkill(6, 20, undefined, basicSwordAttack))

    worldEngine.registerEntity(ranger, server);

    return ranger;
}