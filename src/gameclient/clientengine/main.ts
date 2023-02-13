import { sendPlayerWorldJoinMessage, sendSpectatorWorldJoinMessage } from "../messaging/sendclientworldmessages";
import { setEventListeners } from "./seteventlisteners";
import { OrthographicCamera, WebGLRenderer, Scene, Color } from "three";
import { processNetMessages } from "../messaging/processnetmessages";
import { Client, ClientConfig } from "./client";
import { GameServerStateTypes } from "../../packets/enums/gameserverstatetypes";
import { ClientRoleTypes } from "../../packets/enums/clientroletypes";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { WorldTypes } from "../../packets/enums/worldtypes";

// TODO:
// > Clean up Client class fields and config fields
// > (Done) Set up event handling so only player roles can trigger them
// -> Player roles shouldn't have access to start sending packets until player's entity
// has been created on back end.
// Maybe make a client status? readyToSendMessages boolean?
// > (Done) Start working on creating / destroying / and updating front end entities in messagehandlersystem
// > Reconfigure "packets" directory
// -> probably name it "middleware"
// -> have a new "packets" dir in there as well as a "enums" dir in there
// -> consider putting modules like setUpClientToLobbyConnection.ts in there

// NEW TODO (02/11/2023):
// Lots to do...
// Next work on item equipping - mostly done
// validation on each slot, ui to show each equip slot thing: sword, shield, armor, ring
// primary slot displays "weapon" or item on character's back kinda like genshin
// -> thinking is kinda "follows" you for a cool little effect
// secondary slot still shows weapon rendering when using action
// once we have this working will, bring in other characters

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
    displayHitBoxes: true,
    // globalErrorHandling: true,
    fontUrls: [
        "./data/fonts/helvetiker_regular_typeface.json"
    ],
    // TODO: Pick up files dynamically via fs operation.
    textureUrls: [
        // Misc
        "./data/textures/misc/empty_texture.png",
        // Tilesets
        "./data/textures/tilesets/raven_fantasy_green_forest_16x16.png",
        "./data/textures/tilesets/colored_packed.png",
        // Icons
        "./data/textures/icons/d17.png",
        "./data/textures/icons/d49.png",
        "./data/textures/icons/d20.png",
        "./data/textures/icons/d52.png",
        "./data/textures/icons/d3403.png",
        "./data/textures/icons/d3940.png",
        // VFX
        "./data/textures/vfx/magic_circle.png",
        "./data/textures/vfx/standardbullet.png",
        "./data/textures/vfx/dust_plume.png",
        "./data/textures/vfx/item_pickup_arrow001.png",
        "./data/textures/vfx/item_pickup_arrow002.png",
        "./data/textures/vfx/item_pickup_arrow003.png",
        "./data/textures/vfx/item_pickup_arrow004.png",
        "./data/textures/vfx/action_reticle001.png",
        "./data/textures/vfx/action_reticle002.png",
        "./data/textures/vfx/action_reticle003.png",
        // Items
        "./data/textures/items/arrow.png",
        "./data/textures/items/basic_sword_attack001.png",
        "./data/textures/items/basic_sword_attack002.png",
        "./data/textures/items/basic_sword_attack003.png",
        "./data/textures/items/basic_sword_attack004.png",
        "./data/textures/items/bow_and_arrow001.png",
        "./data/textures/items/bow_and_arrow002.png",
        "./data/textures/items/kenney_sword001.png",
        "./data/textures/items/kenney_sword002.png",
        "./data/textures/items/kenney_sword003.png",
        "./data/textures/items/kenney_bow001.png",
        "./data/textures/items/kenney_bow002.png",
        "./data/textures/items/kenney_arrow.png",
        // NPCs
        "./data/textures/npcs/fish/fish001.png",
        "./data/textures/npcs/fish/fish002.png",
        "./data/textures/npcs/kenney_goblin/kenney_goblin001.png",
        "./data/textures/npcs/kenney_goblin/kenney_goblin002.png",
        "./data/textures/npcs/kenney_goblin/kenney_goblin003.png",
        "./data/textures/npcs/kenney_goblin/kenney_goblin004.png",
        // Pyra idle
        "./data/textures/pyra/idle/Armature_idle_00.png",
        "./data/textures/pyra/idle/Armature_idle_01.png",
        "./data/textures/pyra/idle/Armature_idle_02.png",
        "./data/textures/pyra/idle/Armature_idle_03.png",
        "./data/textures/pyra/idle/Armature_idle_04.png",
        "./data/textures/pyra/idle/Armature_idle_05.png",
        "./data/textures/pyra/idle/Armature_idle_06.png",
        "./data/textures/pyra/idle/Armature_idle_07.png",
        "./data/textures/pyra/idle/Armature_idle_08.png",
        "./data/textures/pyra/idle/Armature_idle_09.png",
        "./data/textures/pyra/idle/Armature_idle_10.png",
        "./data/textures/pyra/idle/Armature_idle_11.png",
        "./data/textures/pyra/idle/Armature_idle_12.png",
        "./data/textures/pyra/idle/Armature_idle_13.png",
        "./data/textures/pyra/idle/Armature_idle_14.png",
        "./data/textures/pyra/idle/Armature_idle_15.png",
        // Pyra walk
        "./data/textures/pyra/walk/Armature_walk3_0.png",
        "./data/textures/pyra/walk/Armature_walk3_1.png",
        "./data/textures/pyra/walk/Armature_walk3_2.png",
        "./data/textures/pyra/walk/Armature_walk3_3.png",
        "./data/textures/pyra/walk/Armature_walk3_4.png",
        "./data/textures/pyra/walk/Armature_walk3_5.png",
        "./data/textures/pyra/walk/Armature_walk3_6.png",
        "./data/textures/pyra/walk/Armature_walk3_7.png",
        // Ranger idle
        "./data/textures/ranger/idle/Heroine_ranger_idle_00.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_01.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_02.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_03.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_04.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_05.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_06.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_07.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_08.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_09.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_10.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_11.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_12.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_13.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_14.png",
        "./data/textures/ranger/idle/Heroine_ranger_idle_15.png",
        // Ranger walk
        "./data/textures/ranger/walk/Heroine_ranger_run_00.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_01.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_02.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_03.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_04.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_05.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_06.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_07.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_08.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_09.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_10.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_11.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_12.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_13.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_14.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_15.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_16.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_17.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_18.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_19.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_20.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_21.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_22.png",
        "./data/textures/ranger/walk/Heroine_ranger_run_23.png",
        // Ranger dodge roll
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_00.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_01.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_02.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_03.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_04.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_05.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_06.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_07.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_08.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_09.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_10.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_11.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_12.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_13.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_14.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_15.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_16.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_17.png",
        "./data/textures/ranger/dodgeroll/Heroine_ranger_dodgeroll_18.png",
        // Ranger action hold
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_00.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_01.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_02.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_03.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_04.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_05.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_06.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_07.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_08.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_09.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_10.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_11.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_12.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_13.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_14.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_15.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_16.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_17.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_18.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_19.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_20.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_21.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_22.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_23.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_24.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_25.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_26.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_27.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_28.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_29.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_30.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_31.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_32.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_33.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_34.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_35.png",
        "./data/textures/ranger/bow_attack/Heroine_ranger_attack_regular_36.png",
    ],
    audioUrls: [
        "./data/audio/Pale_Blue.mp3",
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
    const renderer = new WebGLRenderer();
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