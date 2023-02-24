import { wizardAnim } from "../../modules/animations/animationdata/wizard";
import { knightAnim } from "../../modules/animations/animationdata/knight";
import { rangerAnim } from "../../modules/animations/animationdata/ranger";
import { AnimationSchema } from "../../modules/animations/animationschema";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { pageAnim } from "../../modules/animations/animationdata/page";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { processPlayerInitialInventory } from "../messaging/helpers";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { SkillSlotsComponent } from "../components/skillslots";
import { PlayerStates, setPlayer } from "../components/player";
import { setHitbox, HitboxTypes } from "../components/hitbox";
import { PositionComponent } from "../components/position";
import { ItemData } from "../../packets/data/itemdata";
import { setVelocity } from "../components/velocity";
import { setMovement } from "../components/movement";
import { setAnim } from "../components/animation";
import { setSprite } from "../components/sprite";
import { Entity } from "../serverengine/entity";

export interface PlayerCharacterParams {
    worldEngine: BaseWorldEngine,
    clientId: string,
    spawnPos: PositionComponent,
    class: PlayerClassTypes,
    currentInventory: ItemData[]
}

const getInitialClassSprite = (playerClass: PlayerClassTypes): string => {
    switch (playerClass) {
        case PlayerClassTypes.RANGER:
            return "./assets/textures/ranger/idle/Heroine_ranger_idle_00.png"
        case PlayerClassTypes.KNIGHT:
            return "./assets/textures/knight/idle/Heroine_idle_00.png"
        case PlayerClassTypes.WIZARD:
            return "./assets/textures/wizard/idle/Heroine_wizard_idle_00.png"
        case PlayerClassTypes.PAGE:
            return "./assets/textures/page/idle/Heroine_page_idle_00.png"
    }
}

const getClassAnimBlob = (playerClass: PlayerClassTypes): AnimationSchema => {
    switch (playerClass) {
        case PlayerClassTypes.RANGER:
            return rangerAnim
        case PlayerClassTypes.KNIGHT:
            return knightAnim
        case PlayerClassTypes.WIZARD:
            return wizardAnim
        case PlayerClassTypes.PAGE:
            return pageAnim
    }
}

export function createPlayerCharacter(params: PlayerCharacterParams) {
    // Initialize Player Character entity.
    let playerChar = new Entity();
    // Initialize Player Character player component.
    playerChar.player = setPlayer(params.clientId, PlayerStates.UNLOADED, params.class, params.currentInventory);
    // Initialize Player Character position component with spawn coordinates.
    playerChar.pos = params.spawnPos;
    // Initialize Player Character velocity component.
    playerChar.vel = setVelocity(15, 0.5); // TODO: Set up stats for movement speed.
    // Initialize Player Character sprite component with intial sprite url.
    playerChar.sprite = setSprite(getInitialClassSprite(params.class))
    // Initialize Player Character animation component with class anim blob.
    playerChar.anim = setAnim(getClassAnimBlob(params.class), SequenceTypes.IDLE)
    // Initialize Player Character movement component.
    playerChar.movement = setMovement();
    // Initialize Player Character hitbox component.
    playerChar.hitbox = setHitbox(HitboxTypes.PLAYER, [HitboxTypes.ENEMY, HitboxTypes.ITEM_DROP], 50, 50, 0, -50);
    // Initialize Player Character skill slots component.
    playerChar.skillSlots = new SkillSlotsComponent();
    // Initialize Player skill slots based on inventory.
    processPlayerInitialInventory(playerChar, params.currentInventory, params.worldEngine)
    // Register Player Character entity to world.
    params.worldEngine.registerEntity(playerChar, params.worldEngine.server);

    return playerChar;
}
