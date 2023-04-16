import { sendPlayerWorldJoinMessage, sendSpectatorWorldJoinMessage } from "../messaging/sendclientworldmessages";
import { UIStateTypes } from "../../packets/enums/gameserverstatetypes";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { ClientRoleTypes } from "../../packets/enums/clientroletypes";
import { processNetMessages } from "../messaging/processnetmessages";
import { textureUrls } from "../../database/urls/textureurls";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { audioUrls } from "../../database/urls/audiourls";
import { fontUrls } from "../../database/urls/fonturls";
import { setEventListeners } from "./seteventlisteners";
import { Client, ClientConfig } from "./client";
import { WebGLRenderer } from "three";

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
// (Done) secondary slot still shows weapon rendering when using action
// (Done) once we have this working well, bring in other characters
// (Done) HP / MP UI 
// (Done) Preset inventories for each class, this can't sit in archetype code since that gets re-used for changing worlds
// (Done) Set up "Gamertag" -> if user doesn't type it in they become "Player [NetId]"
// (Done) Render this plus HP bars, Lv above character entities / enemy names, Lv and HP bars over enemies.
// More advanced "cooldown" subsystem. Stutter ticks ain't working well for dodgeroll and skills.
// (Challenge) chat window in bottom left of screen
// Get goblin hp in nameplate to reflect current hp
// Tiled data loader.
// Character portraits & gold UI next to Lv
// Better enemy AI.
// Better weapon skill actions.
// Fishing system.
// Damage numbers: should be ent animation going up for a time.
// Movement: use state machines!! For anims AND movement smdh
// Bring back client render -> render vfx based on certain animations
// -> For example, sword slash should include sword trails and dust plumes
// -> These types of renders shouldn't need to get sent from server at all

// Known Bugs:
// Max HP upgrades (and likely all stat upgrades) don't seem to reflect in ui
// Up key events won't send if browser get unfocused or chat gets focused mid movement
// -> Solution: Track "down" events and automatically send respective "up" event when play is interrupted
// Putting inventory away (pressing I while dragging an item) causes the item to get stuck wherever it was dragged to.
// Enemies are sharing the same health values for some reason

const params = <URLSearchParams> new URLSearchParams(window.location.search);

const config: ClientConfig = {
    role: params.get("clientRole") as ClientRoleTypes, // Role would change how event handling works. Only need player sending key press events for example.
    playerClass: params.get("playerClass") as PlayerClassTypes,
    username: params.get("username"),
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
    fontUrls: fontUrls,
    textureUrls: textureUrls, // TODO: Pick up files dynamically via fs operation.
    audioUrls: audioUrls,
}

// Remove url params.
window.history.replaceState(null, null, window.location.pathname);

export const client = new Client(config);

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
    client.initializeClient();

    // This might should go into initializeClient
    client.initializeUIState(UIStateTypes.TITLE_SCREEN);
    // client.initializeUIState(UIStateTypes.GAMEPLAY);
    
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