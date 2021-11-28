import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setControls } from "../components/control";
import { Entity } from "../serverengine/entity";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Server } from "../serverengine/server";
import { PlayerStates } from "../components/player";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { initializeSkill, SkillSlotsComponent } from "../components/skillslots";
import { basicSwordAttack } from "../actions/sword";

export function createArcher(server: Server, worldEngine: BaseWorldEngine, clientId: string, pos: PositionComponent): Entity {
    let archer = new Entity();
    archer.player = { id: clientId, state: PlayerStates.UNLOADED, class: PlayerClassTypes.ARCHER };
    archer.pos = pos;
    archer.vel = setVelocity(15, 0.5);
    archer.sprite = { url: "./data/textures/archer_girl_from_sketch.png", pixelRatio: 1 };
    // archer.anim = { sequence: "blah", currentFrame: 0 };
    archer.control = setControls();
    archer.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY], 50, 50, 0, -50);
    archer.skillSlots = new SkillSlotsComponent()
    // archer.skillSlots.setSkillOne(initializeSkill(20, 20, () => { console.log("skilllling")}))
    archer.skillSlots.setSkillOne(initializeSkill(20, 20, basicSwordAttack))

    worldEngine.registerEntity(archer, server);

    return archer;
}