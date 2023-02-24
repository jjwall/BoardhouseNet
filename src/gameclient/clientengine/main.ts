import { sendPlayerWorldJoinMessage, sendSpectatorWorldJoinMessage } from "../messaging/sendclientworldmessages";
import { setEventListeners } from "./seteventlisteners";
import { OrthographicCamera, WebGLRenderer, Scene, Color } from "three";
import { processNetMessages } from "../messaging/processnetmessages";
import { Client, ClientConfig } from "./client";
import { GameServerStateTypes } from "../../packets/enums/gameserverstatetypes";
import { ClientRoleTypes } from "../../packets/enums/clientroletypes";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { WorldTypes } from "../../packets/enums/worldtypes";

// TODO (06/01/2021):
// > Clean up Client class fields and config fields
// -> Player roles shouldn't have access to start sending packets until player's entity
// has been created on back end.
// Maybe make a client status? readyToSendMessages boolean?

// NEW TODO (02/11/2023):
// (done) Next work on item equipping - mostly done
// (done) ui to show each equip slot thing: sword, shield, armor, ring
// (done) Actual equips do something now... need equip slots / item data to interface with skill slots.
// (done) validation on each slot
// (done) primary slot displays "weapon" or item on character's back kinda like genshin
// -> (done) thinking is kinda "follows" you for a cool little effect
// secondary slot still shows weapon rendering when using action
// once we have this working well, bring in other characters
// (Done) HP / MP UI 
// -> (later...) Character portraits & gold UI next to Lv
// Preset inventories for each class, this can't sit in archetype code since that gets re-used for changing worlds
// Set up "Gamertag" -> if user doesn't type it in they become "Player [NetId]"
// Render this plus HP bars, Lv above character entities / enemy names, Lv and HP bars over enemies.
// More advanced "cooldown" subsystem. Stutter ticks ain't working well for dodgeroll and skills.
// (Challenge) chat window in bottom left of screen
// Tiled data loader.
// Better enemy AI.
// Better weapon skill actions.
// Fishing system.

const params = <URLSearchParams> new URLSearchParams(window.location.search);

const config: ClientConfig = {
    role: params.get("clientRole") as ClientRoleTypes, // Role would change how event handling works. Only need player sending key press events for example.
    playerClass: params.get("playerClass") as PlayerClassTypes,
    worldType: params.get("worldType") as WorldTypes,
    connection: <WebSocket> null,
    currentPort: <number>parseInt(params.get("port")),
    currentClientId: params.get("clientId"),
    hostName: <string>window.location.hostname != "" ? window.location.hostname : "localhost",
    // netIdToEntMap: Array<NetIdToEntMap> // TODO: Implement!! (FrontEnt vs BackEnt, EntData is separate)
    /// ----
    screenWidth: 1280,
    screenHeight: 720,
    // gameTicksPerSecond: 60,
    // displayFPS: true,
    displayHitBoxes: false,
    // globalErrorHandling: true,
    fontUrls: [
        "./assets/fonts/helvetiker_regular_typeface.json"
    ],
    // TODO: Pick up files dynamically via fs operation.
    textureUrls: [
        // Misc
        "./assets/textures/misc/empty_texture.png",
        // Tilesets
        "./assets/textures/tilesets/raven_fantasy_green_forest_16x16.png",
        "./assets/textures/tilesets/colored_packed.png",
        // Icons
        "./assets/textures/icons/d17.png",
        "./assets/textures/icons/d49.png",
        "./assets/textures/icons/d20.png",
        "./assets/textures/icons/d52.png",
        "./assets/textures/icons/d3403.png",
        "./assets/textures/icons/d3940.png",
        "./assets/textures/icons/sword_inventory_icon.png",
        "./assets/textures/icons/shield_inventory_icon.png",
        "./assets/textures/icons/armor_inventory_icon.png",
        "./assets/textures/icons/accessory_inventory_icon.png",
        // VFX
        "./assets/textures/vfx/magic_circle.png",
        "./assets/textures/vfx/standardbullet.png",
        "./assets/textures/vfx/dust_plume.png",
        "./assets/textures/vfx/item_pickup_arrow001.png",
        "./assets/textures/vfx/item_pickup_arrow002.png",
        "./assets/textures/vfx/item_pickup_arrow003.png",
        "./assets/textures/vfx/item_pickup_arrow004.png",
        "./assets/textures/vfx/action_reticle001.png",
        "./assets/textures/vfx/action_reticle002.png",
        "./assets/textures/vfx/action_reticle003.png",
        // Items
        "./assets/textures/items/arrow.png",
        "./assets/textures/items/basic_sword_attack001.png",
        "./assets/textures/items/basic_sword_attack002.png",
        "./assets/textures/items/basic_sword_attack003.png",
        "./assets/textures/items/basic_sword_attack004.png",
        "./assets/textures/items/bow_and_arrow001.png",
        "./assets/textures/items/bow_and_arrow002.png",
        "./assets/textures/items/kenney_sword001.png",
        "./assets/textures/items/kenney_sword002.png",
        "./assets/textures/items/kenney_sword003.png",
        "./assets/textures/items/kenney_bow001.png",
        "./assets/textures/items/kenney_bow002.png",
        "./assets/textures/items/kenney_arrow.png",
        // NPCs
        "./assets/textures/npcs/fish/fish001.png",
        "./assets/textures/npcs/fish/fish002.png",
        "./assets/textures/npcs/kenney_goblin/kenney_goblin001.png",
        "./assets/textures/npcs/kenney_goblin/kenney_goblin002.png",
        "./assets/textures/npcs/kenney_goblin/kenney_goblin003.png",
        "./assets/textures/npcs/kenney_goblin/kenney_goblin004.png",
        // Pyra idle
        "./assets/textures/pyra/idle/Armature_idle_00.png",
        "./assets/textures/pyra/idle/Armature_idle_01.png",
        "./assets/textures/pyra/idle/Armature_idle_02.png",
        "./assets/textures/pyra/idle/Armature_idle_03.png",
        "./assets/textures/pyra/idle/Armature_idle_04.png",
        "./assets/textures/pyra/idle/Armature_idle_05.png",
        "./assets/textures/pyra/idle/Armature_idle_06.png",
        "./assets/textures/pyra/idle/Armature_idle_07.png",
        "./assets/textures/pyra/idle/Armature_idle_08.png",
        "./assets/textures/pyra/idle/Armature_idle_09.png",
        "./assets/textures/pyra/idle/Armature_idle_10.png",
        "./assets/textures/pyra/idle/Armature_idle_11.png",
        "./assets/textures/pyra/idle/Armature_idle_12.png",
        "./assets/textures/pyra/idle/Armature_idle_13.png",
        "./assets/textures/pyra/idle/Armature_idle_14.png",
        "./assets/textures/pyra/idle/Armature_idle_15.png",
        // Pyra walk
        "./assets/textures/pyra/walk/Armature_walk3_0.png",
        "./assets/textures/pyra/walk/Armature_walk3_1.png",
        "./assets/textures/pyra/walk/Armature_walk3_2.png",
        "./assets/textures/pyra/walk/Armature_walk3_3.png",
        "./assets/textures/pyra/walk/Armature_walk3_4.png",
        "./assets/textures/pyra/walk/Armature_walk3_5.png",
        "./assets/textures/pyra/walk/Armature_walk3_6.png",
        "./assets/textures/pyra/walk/Armature_walk3_7.png",
        // Ranger idle
        "./assets/textures/ranger/idle/Heroine_ranger_idle_00.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_01.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_02.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_03.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_04.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_05.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_06.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_07.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_08.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_09.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_10.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_11.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_12.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_13.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_14.png",
        "./assets/textures/ranger/idle/Heroine_ranger_idle_15.png",
        // Ranger walk
        "./assets/textures/ranger/walk/Heroine_ranger_run_00.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_01.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_02.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_03.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_04.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_05.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_06.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_07.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_08.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_09.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_10.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_11.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_12.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_13.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_14.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_15.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_16.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_17.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_18.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_19.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_20.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_21.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_22.png",
        "./assets/textures/ranger/walk/Heroine_ranger_run_23.png",
        // Ranger dodge roll
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_00.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_01.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_02.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_03.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_04.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_05.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_06.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_07.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_08.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_09.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_10.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_11.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_12.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_13.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_14.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_15.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_16.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_17.png",
        "./assets/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_18.png",
        // Ranger action hold
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_00.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_01.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_02.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_03.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_04.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_05.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_06.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_07.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_08.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_09.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_10.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_11.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_12.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_13.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_14.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_15.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_16.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_17.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_18.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_19.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_20.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_21.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_22.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_23.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_24.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_25.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_26.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_27.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_28.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_29.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_30.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_31.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_32.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_33.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_34.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_35.png",
        "./assets/textures/ranger/bow_attack/Heroine_ranger_attack_regular_36.png",
        // Knight idle
        "./assets/textures/knight/idle/Heroine_idle_00.png",
        "./assets/textures/knight/idle/Heroine_idle_01.png",
        "./assets/textures/knight/idle/Heroine_idle_02.png",
        "./assets/textures/knight/idle/Heroine_idle_03.png",
        "./assets/textures/knight/idle/Heroine_idle_04.png",
        "./assets/textures/knight/idle/Heroine_idle_05.png",
        "./assets/textures/knight/idle/Heroine_idle_06.png",
        "./assets/textures/knight/idle/Heroine_idle_07.png",
        "./assets/textures/knight/idle/Heroine_idle_08.png",
        "./assets/textures/knight/idle/Heroine_idle_09.png",
        "./assets/textures/knight/idle/Heroine_idle_10.png",
        "./assets/textures/knight/idle/Heroine_idle_11.png",
        "./assets/textures/knight/idle/Heroine_idle_12.png",
        "./assets/textures/knight/idle/Heroine_idle_13.png",
        "./assets/textures/knight/idle/Heroine_idle_14.png",
        "./assets/textures/knight/idle/Heroine_idle_15.png",
        // Knight walk
        "./assets/textures/knight/walk/Heroine_run_00.png",
        "./assets/textures/knight/walk/Heroine_run_01.png",
        "./assets/textures/knight/walk/Heroine_run_02.png",
        "./assets/textures/knight/walk/Heroine_run_03.png",
        "./assets/textures/knight/walk/Heroine_run_04.png",
        "./assets/textures/knight/walk/Heroine_run_05.png",
        "./assets/textures/knight/walk/Heroine_run_06.png",
        "./assets/textures/knight/walk/Heroine_run_07.png",
        "./assets/textures/knight/walk/Heroine_run_08.png",
        "./assets/textures/knight/walk/Heroine_run_09.png",
        "./assets/textures/knight/walk/Heroine_run_10.png",
        "./assets/textures/knight/walk/Heroine_run_11.png",
        "./assets/textures/knight/walk/Heroine_run_12.png",
        "./assets/textures/knight/walk/Heroine_run_13.png",
        "./assets/textures/knight/walk/Heroine_run_14.png",
        "./assets/textures/knight/walk/Heroine_run_15.png",
        "./assets/textures/knight/walk/Heroine_run_16.png",
        "./assets/textures/knight/walk/Heroine_run_17.png",
        "./assets/textures/knight/walk/Heroine_run_18.png",
        "./assets/textures/knight/walk/Heroine_run_19.png",
        "./assets/textures/knight/walk/Heroine_run_20.png",
        "./assets/textures/knight/walk/Heroine_run_21.png",
        "./assets/textures/knight/walk/Heroine_run_22.png",
        "./assets/textures/knight/walk/Heroine_run_23.png",
        // Knight dodgeroll
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_00.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_01.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_02.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_03.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_04.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_05.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_06.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_07.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_08.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_09.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_10.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_11.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_12.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_13.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_14.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_15.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_16.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_17.png",
        "./assets/textures/knight/dodgeroll/Heroine_dodgeroll_18.png",
        // Knight spear attack
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_00.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_01.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_02.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_03.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_04.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_05.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_06.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_07.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_08.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_09.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_10.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_11.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_12.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_13.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_14.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_15.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_16.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_17.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_18.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_19.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_20.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_21.png",
        "./assets/textures/knight/spear_attack/Heroine_attack_poke_22.png",
        // Wizard idle
        "./assets/textures/wizard/idle/Heroine_wizard_idle_00.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_01.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_02.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_03.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_04.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_05.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_06.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_07.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_08.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_09.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_10.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_11.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_12.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_13.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_14.png",
        "./assets/textures/wizard/idle/Heroine_wizard_idle_15.png",
        // Wizard walk
        "./assets/textures/wizard/walk/Heroine_wizard_run_00.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_01.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_02.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_03.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_04.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_05.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_06.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_07.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_08.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_09.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_10.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_11.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_12.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_13.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_14.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_15.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_16.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_17.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_18.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_19.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_20.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_21.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_22.png",
        "./assets/textures/wizard/walk/Heroine_wizard_run_23.png",
        // Wizard dodgeroll
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_00.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_01.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_02.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_03.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_04.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_05.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_06.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_07.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_08.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_09.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_10.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_11.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_12.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_13.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_14.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_15.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_16.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_17.png",
        "./assets/textures/wizard/dodgeroll/Heroine_wizard_dodgeroll_18.png",
        // Wizard basic attack
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_00.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_01.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_02.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_03.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_04.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_05.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_06.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_07.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_08.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_09.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_10.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_11.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_12.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_13.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_14.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_15.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_16.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_17.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_18.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_19.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_20.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_21.png",
        "./assets/textures/wizard/basic_attack/Heroine_wizard_attack_regular_22.png",
    ],
    audioUrls: [
        "./assets/audio/Pale_Blue.mp3",
    ],
}

// Remove url params.
window.history.replaceState(null, null, window.location.pathname);

const client = new Client(config);

client.connection = new WebSocket("ws://" + 
                                           client.hostName + ":" +
                                           client.currentPort);

client.connection.onopen = function() {
    switch (client.role) {
        case ClientRoleTypes.PLAYER:
            sendPlayerWorldJoinMessage(client);
            break;
        case ClientRoleTypes.SPECTATOR:
            sendSpectatorWorldJoinMessage(client);
            break;
    }
}

client.loadAssets().then(() => {
    client.initializeState(GameServerStateTypes.GAMEPLAY);
    main(<HTMLElement>document.getElementById("canvasContainer"));
});

/**
 * 
 * @param canvasContainer Captured Canvas Container Element
 * 
 * Main function that gets immediately invoked.
 * Only dependecy is the canvas container element. Also triggers the event pump.
 */
function main(canvasContainer: HTMLElement) {
    // set up renderer
    const renderer = new WebGLRenderer({ antialias: true });;
    renderer.setSize(client.screenWidth, client.screenHeight);
    renderer.autoClear = false;
    client.renderer = renderer;

    // append canvas element to canvas container
    canvasContainer.append(renderer.domElement);

    // disable right click context menu
    renderer.domElement.oncontextmenu = function (e) {
        e.preventDefault();
    };

    const fps = 144;
    // let fps: number = 0;
    // let totalTime: number = 0;
    // let currentTime: number = 0;

    // set up event listeners
    setEventListeners(renderer.domElement, client);

    // render update loop
    function renderLoop(timeStamp: number) {
        setTimeout(function() {
            requestAnimationFrame(renderLoop);
            // currentTime = timeStamp - totalTime;
            // totalTime = timeStamp;
            // fps = 1 / (currentTime / 1000);

            client.render();
        }, 1000 / fps);
    }

    // start the render loop
    renderLoop(0);

    processNetMessages(client);
}