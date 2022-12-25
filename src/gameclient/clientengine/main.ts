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
    textureUrls: [
        "./data/textures/empty_texture.png",
        "./data/textures/cottage.png",
        "./data/textures/msknight.png",
        "./data/textures/snow.png",
        "./data/textures/mediumExplosion1.png",
        "./data/textures/archer_girl_from_sketch.png",
        "./data/textures/colored_packed.png",
        "./data/textures/magic_circle.png",
        "./data/textures/necrowalk1.png",
        "./data/textures/necrowalk2.png",
        "./data/textures/necrowalk3.png",
        "./data/textures/necroattack1.png",
        "./data/textures/necroattack2.png",
        "./data/textures/unholyblast1.png",
        "./data/textures/unholyblast2.png",
        "./data/textures/unholyblast3.png",
        "./data/textures/zelfin001.png",
        "./data/textures/zelfin002.png",
        "./data/textures/zelfin003.png",
        "./data/textures/zelfin004.png",
        "./data/textures/zelfin005.png",
        "./data/textures/zelfin006.png",
        "./data/textures/zelfin007.png",
        "./data/textures/zelfin008.png",
        "./data/textures/basic_sword_attack001.png",
        "./data/textures/basic_sword_attack002.png",
        "./data/textures/basic_sword_attack003.png",
        "./data/textures/basic_sword_attack004.png",
        "./data/textures/fish001.png",
        "./data/textures/fish002.png",
        "./data/textures/standardbullet.png",
        "./data/textures/action_reticle001.png",
        "./data/textures/action_reticle002.png",
        "./data/textures/action_reticle003.png",
        "./data/textures/kenney_goblin001.png",
        "./data/textures/kenney_goblin002.png",
        "./data/textures/kenney_goblin003.png",
        "./data/textures/kenney_goblin004.png",
        "./data/textures/bow_and_arrow001.png",
        "./data/textures/bow_and_arrow002.png",
        "./data/textures/arrow.png",
        "./data/textures/gizmolo001.png",
        "./data/textures/gizmolo002.png",
        "./data/textures/gizmolo003.png",
        "./data/textures/gizmolo004.png",
        "./data/textures/gizmolo005.png",
        "./data/textures/gizmolo006.png",
        "./data/textures/gizmolo007.png",
        "./data/textures/gizmolo008.png",
        "./data/textures/gizmolo009.png",
        "./data/textures/gizmolo010.png",
        "./data/textures/player_stand.png",
        "./data/textures/player_action1.png",
        "./data/textures/player_action2.png",
        "./data/textures/player_walk1.png",
        "./data/textures/player_walk2.png",
        "./data/textures/kenney_sword001.png",
        "./data/textures/kenney_sword002.png",
        "./data/textures/kenney_sword003.png",
        "./data/textures/kenney_bow001.png",
        "./data/textures/kenney_bow002.png",
        "./data/textures/kenney_arrow.png",
        "./data/textures/Armature_idle_00.png",
        "./data/textures/Armature_idle_01.png",
        "./data/textures/Armature_idle_02.png",
        "./data/textures/Armature_idle_03.png",
        "./data/textures/Armature_idle_04.png",
        "./data/textures/Armature_idle_05.png",
        "./data/textures/Armature_idle_06.png",
        "./data/textures/Armature_idle_07.png",
        "./data/textures/Armature_idle_08.png",
        "./data/textures/Armature_idle_09.png",
        "./data/textures/Armature_idle_10.png",
        "./data/textures/Armature_idle_11.png",
        "./data/textures/Armature_idle_12.png",
        "./data/textures/Armature_idle_13.png",
        "./data/textures/Armature_idle_14.png",
        "./data/textures/Armature_idle_15.png",
        "./data/textures/Armature_idle_16.png",
        "./data/textures/Armature_walk_00.png",
        "./data/textures/Armature_walk_01.png",
        "./data/textures/Armature_walk_02.png",
        "./data/textures/Armature_walk_03.png",
        "./data/textures/Armature_walk_04.png",
        "./data/textures/Armature_walk_05.png",
        "./data/textures/Armature_walk_06.png",
        "./data/textures/Armature_walk_07.png",
        "./data/textures/Armature_walk_08.png",
        "./data/textures/Armature_walk_09.png",
        "./data/textures/Armature_walk_10.png",
        "./data/textures/Armature_walk_11.png",
        "./data/textures/Armature_walk_12.png",
        "./data/textures/Armature_walk_13.png",
        "./data/textures/Armature_walk_14.png",
        "./data/textures/Armature_walk_15.png",
        "./data/textures/Armature_walk_16.png",
        "./data/textures/Armature_walk_17.png",
        "./data/textures/Armature_walk_18.png",
        "./data/textures/Armature_walk_19.png",
        "./data/textures/Armature_walk_20.png",
        "./data/textures/Armature_walk_21.png",
        "./data/textures/Armature_walk_22.png",
        "./data/textures/Armature_walk_23.png",
        "./data/textures/Armature_walk_24.png",
        "./data/textures/Armature_bow_action_00.png",
        "./data/textures/Armature_bow_action_01.png",
        "./data/textures/Armature_bow_action_02.png",
        "./data/textures/Armature_bow_action_03.png",
        "./data/textures/Armature_bow_action_04.png",
        "./data/textures/Armature_bow_action_05.png",
        "./data/textures/Armature_bow_action_06.png",
        "./data/textures/Armature_bow_action_07.png",
        "./data/textures/Armature_bow_action_08.png",
        "./data/textures/Armature_bow_action_09.png",
        "./data/textures/Armature_bow_action_10.png",
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
        "./data/textures/pyra/walk/Armature_walk3_0.png",
        "./data/textures/pyra/walk/Armature_walk3_1.png",
        "./data/textures/pyra/walk/Armature_walk3_2.png",
        "./data/textures/pyra/walk/Armature_walk3_3.png",
        "./data/textures/pyra/walk/Armature_walk3_4.png",
        "./data/textures/pyra/walk/Armature_walk3_5.png",
        "./data/textures/pyra/walk/Armature_walk3_6.png",
        "./data/textures/pyra/walk/Armature_walk3_7.png",
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