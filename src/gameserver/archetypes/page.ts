import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { setVelocity } from "../components/velocity";
import { setMovement } from "../components/movement";
import { Entity } from "../serverengine/entity";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Server } from "../serverengine/server";
import { PlayerStates } from "../components/player";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { pyraAnim } from "../../modules/animations/animationdata/pyra";
import { initializeSkill, SkillSlotsComponent } from "../components/skillslots";
import { basicSwordAttack } from "../actions/sword";

export function createPage(server: Server, worldEngine: BaseWorldEngine, clientId: string, pos: PositionComponent): Entity {
    let page = new Entity();
    page.player = { id: clientId, state: PlayerStates.UNLOADED, class: PlayerClassTypes.PAGE };
    page.pos = pos;
    page.vel = setVelocity(15, 0.5);
    page.sprite = { url: "./data/textures/pyra/idle/Armature_idle_00.png", pixelRatio: 1 };
    page.anim = { sequence: SequenceTypes.IDLE, blob: pyraAnim };
    page.movement = setMovement();
    page.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY, HitboxTypes.ITEM_DROP], 50, 50, 0, -50);
    page.skillSlots = new SkillSlotsComponent();
    page.skillSlots.setSkillOne(initializeSkill(6, 20, basicSwordAttack, undefined));

    worldEngine.registerEntity(page, server);

    return page;
}