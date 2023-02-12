import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setMovement } from "../components/movement";
import { Entity } from "../serverengine/entity";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Server } from "../serverengine/server";
import { PlayerStates, setPlayer } from "../components/player";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { initializeSkill, SkillSlotsComponent } from "../components/skillslots";
import { basicSwordAttack } from "../actions/sword";
import { fireballPress, fireballRelease } from "../actions/fireball";
import { bowAndArrowPress, bowAndArrowRelease } from "../actions/bowandarrow";
import { presetInventory } from "../../../database/preset_inventory";

export function createMagician(server: Server, worldEngine: BaseWorldEngine, clientId: string, pos: PositionComponent): Entity {
    let magician = new Entity();
    magician.player = setPlayer(clientId, PlayerStates.UNLOADED, PlayerClassTypes.MAGICIAN, presetInventory);
    magician.pos = pos;
    magician.vel = setVelocity(15, 0.5);
    // magician.sprite = { url: "./data/textures/player_stand.png", pixelRatio: 1 };
    // magician.anim = { sequence: SequenceTypes.IDLE, blob: kenneyPlayerAnim };
    magician.movement = setMovement();
    magician.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY, HitboxTypes.ITEM_DROP], 50, 50, 0, -50);
    magician.skillSlots = new SkillSlotsComponent();
    magician.skillSlots.setSkillOne(initializeSkill(6, 20, basicSwordAttack, undefined));
    magician.skillSlots.setSkillTwo(initializeSkill(0, 10, fireballPress, fireballRelease, false)); // cooldown starts after release
    // magician.skillSlots.setSkillTwo(initializeSkill(0, 10, fireballPress, fireballRelease)); // cooldown starts after press

    worldEngine.registerEntity(magician, server);

    return magician;
}