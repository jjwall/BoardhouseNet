import { BufferGeometry, ShapeGeometry, WebGLRenderer, Audio, AudioListener, Scene, Camera, Color, OrthographicCamera, Vector3, Mesh } from "three";
import { handlePointerDownEvent, handlePointerMoveEvent, handlePointerUpEvent } from "../events/pointerevents";
import { sendPlayerInventoryEventMessage } from "../messaging/sendclientworldmessages";
import { GlobalState, renderGamePlayUi, Root } from "../ui/states/gameplay/rootui";
import { UrlToTextureMap, UrlToFontMap, UrlToAudioBufferMap } from "./interfaces";
import { GameServerStateTypes } from "../../packets/enums/gameserverstatetypes";
import { handleKeyDownEvent, handleKeyUpEvent } from "../events/keyboardevents";
import { presetEmptyInventory } from "../../database/inventory/preset_emptyinventory";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { loadFonts, loadTextures, loadAudioBuffers } from "./loaders";
import { ClientRoleTypes } from "../../packets/enums/clientroletypes";
import { UIEventTypes } from "../../packets/enums/uieventtypes";
import { SceneTransition } from "../renders/scenetransitions";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { createWidget, Widget } from "../ui/core/widget";
import { ClientRender } from "../renders/clientrender";
import { animationSystem } from "../systems/animation";
import { layoutWidget } from "../ui/core/layoutwidget";
import { EventTypes } from "../events/eventtypes";
import { NetIdToEntityMap } from "./interfaces";
import { centerCameraOnPlayer } from "./camera";
import { ClientEntity } from "./cliententity";

export interface ClientConfig {
    /// state stuff ///



    /// end state stuff ///
    role: ClientRoleTypes;
    playerClass: PlayerClassTypes;
    username: string;
    worldType: WorldTypes;
    /// old configs
    connection: WebSocket;
    currentPort: number;
    currentClientId: string;
    hostName: string;
    // end old configs
    screenWidth: number;
    screenHeight: number;
    // gameTicksPerSecond: number; // -> don't need
    // displayFPS: boolean; // -> set up later
    displayHitBoxes: boolean;
    // globalErrorHandling: boolean; // -> set up later
    fontUrls: string[];
    textureUrls: string[];
    audioUrls: string[];
}

export class Client {
    constructor(config: ClientConfig) {
        ///
        this.role = config.role;
        this.playerClass = config.playerClass;
        this.username = config.username;
        this.worldType = config.worldType;
        ///
        // vvv merged from old configs vvv
        this.connection = config.connection;
        this.currentPort = config.currentPort;
        this.currentClientId = config.currentClientId;
        this.hostName = config.hostName;

        // Inputs
        this.keyLeftIsDown = false;
        this.keyRightIsDown = false;
        this.keyUpIsDown = false;
        this.keyDownIsDown = false;
        this.keyZIsDown = false;
        this.keyXIsDown = false;
        this.dodgeKeyPressed = false;
        this.inventoryKeyPressed = false;

        // ...
        // vvv regular engine stuff vvv
        this.screenWidth = config.screenWidth;
        this.screenHeight = config.screenHeight;
        // this.millisecondsPerGameTick = 1000 / config.gameTicksPerSecond;
        // this.displayFPS = config.displayFPS;
        this.displayHitBoxes = config.displayHitBoxes;
        // this.globalErrorHandling = config.globalErrorHandling;
        this.fontUrls = config.fontUrls;
        this.textureUrls = config.textureUrls;
        this.audioUrls = config.audioUrls;
    }

    /// state stuff
    public currentPlayerEntity: ClientEntity; // just a reference
    public role: ClientRoleTypes;
    public playerClass: PlayerClassTypes;
    public username: string;
    public gameScene: Scene;
    public gameCamera: Camera;
    public uiScene: Scene;
    public uiCamera: Camera;
    public entityList: ClientEntity[] = [];
    public NetIdToEntityMap: NetIdToEntityMap = {};
    /**
     * @deprecated use entities instead
     */
    public renderList: ClientRender[] = [];
    public sceneTransition: SceneTransition = undefined;
    public sceneTransitionDone: boolean = false;
    public tileMeshList: Mesh[] = [];

    /// end state stuff

    /// vvv old configs vvv
    connection: WebSocket;
    currentPort: number;
    currentClientId: string;
    hostName: string;
    keyLeftIsDown: boolean;
    keyRightIsDown: boolean;
    keyUpIsDown: boolean;
    keyDownIsDown: boolean;
    keyZIsDown: boolean;
    keyXIsDown: boolean;
    dodgeKeyPressed: boolean;
    inventoryKeyPressed: boolean;

    /// ^^^ old configs ^^^
    public rootComponent: Root;
    public rootWidget: Widget;

    public screenWidth: number;

    public screenHeight: number;
    public worldWidth: number; // set in renderTileMap method
    public worldHeight: number; // set in renderTileMap method
    public worldType: WorldTypes;

    public millisecondsPerGameTick: number;

    public displayFPS: boolean;

    public globalErrorHandling: boolean;

    public displayHitBoxes: boolean;

    public FPS: number;

    public renderer: WebGLRenderer;

    public fontUrls: string[];

    public textureUrls: string[];

    public audioUrls: string[];
    
    private _textures: UrlToTextureMap = {};

    private _fonts: UrlToFontMap = {};

    private _audioBuffers: UrlToAudioBufferMap = {};

    private _textGeometries: { [k: string]: BufferGeometry } = {};

    private setFonts(value: UrlToFontMap) {
        this._fonts = value;
    }

    private setTextures(value: UrlToTextureMap) {
        this._textures = value;
    }

    private setAudioBuffers(value: UrlToAudioBufferMap) {
        this._audioBuffers = value;
    }

    public async loadAssets() {
        await Promise.all([
            loadFonts(this.fontUrls),
            loadTextures(this.textureUrls),
            loadAudioBuffers(this.audioUrls)
        ]).then((assets) => {
            this.setFonts(assets[0]);
            this.setTextures(assets[1]);
            this.setAudioBuffers(assets[2]);
        });
    }

    public getFont(url: string) {
        if (!this._fonts[url]) {
            throw new Error(`Font not found at url: "${url}". Check url and ensure font url is being passed in to loadFonts().`);
        }

        return this._fonts[url];
    }

    public getTexture(url: string) {
        if (!this._textures[url]) {
            throw new Error(`Texture not found at url: "${url}". Check url and ensure texture url is being passed in to loadTextures().`);
        }

        return this._textures[url];
    }

    public getAudioBuffer(url: string) {
        if (!this._audioBuffers[url]) {
            throw new Error(`Audio element not found at url: "${url}". Check url and ensure audio element url is being passed in to loadAudioElements().`);
        }

        return this._audioBuffers[url];
    }

    // TODO: Have way to clean up old cached text geometries.
    public getTextGeometry(contents: string, fontUrl: string, font_size: number) {
        const key = `${contents}|${fontUrl}|${font_size}`;
        const geom = this._textGeometries[key];
        if (geom) {
            return geom;
        } else {
            const font = this.getFont(fontUrl);
            const shapes = font.generateShapes(contents, font_size);
            const geometry = new ShapeGeometry(shapes);

            // vvv Old code, we don't want text centered vvv
            // Ensure font is centered on (parent) widget.
            // geometry.computeBoundingBox();
            // const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            // geometry.translate(xMid, 0, 0);

            this._textGeometries[key] = geometry;

            return geometry;
        }
    }

    public playAudio(url: string, scene: Scene, camera: Camera, volume?: number, loop?: boolean) {
        const audioListener = new AudioListener();
        const audio = new Audio(audioListener);

        // add the listener to the camera
        camera.add(audioListener);

        // add the audio object to the scene
        scene.add(audio);

        audio.setBuffer(this.getAudioBuffer(url));

        if (volume) {
            if (volume < 0 || volume > 1)
                throw Error("volume can't be a value less than 0 or greater than 1.");
            
            audio.setVolume(volume);
        }

        if (loop)
            audio.loop = loop;

        audio.play();
    }

    /**
     * Initialize Game Client state based on Game Server state.
     * @param gameServerState
     */
    public initializeState(gameServerState: GameServerStateTypes) {
        switch (gameServerState) {
            case GameServerStateTypes.GAMEPLAY:
                // do stuff based on game server state
                console.log("initializing client for game play state");
                // Set up game scene.
                this.gameScene = new Scene();
                // this.gameScene.background = new Color("#FFFFFF");
                this.gameScene.background = new Color("#547e64");

                // Set up game camera.
                this.gameCamera = new OrthographicCamera(0, this.screenWidth, this.screenHeight, 0, -1000, 1000);

                // Set up ui scene.
                this.uiScene = new Scene();

                // Set up ui camera.
                this.uiCamera = new OrthographicCamera(0, this.screenWidth, 0, -this.screenHeight, -1000, 1000);

                // Set up ui widget and instance.
                this.rootWidget = createWidget("root");
                this.uiScene.add(this.rootWidget);

                this.rootComponent = renderGamePlayUi(this.uiScene, this.rootWidget, {
                    // TODO: Thinking about this more... if we ever want to "unload" ui
                    // in the midst of someone's gameplay, this initial state will be invalid
                    // we would have to pass around a ui state object through
                    // player world transition messages and what not
                    initialState: {
                        // Using preset client inventory for now.
                        // In future pull from database or pre-set data set.
                        // Todo: Load from playerJoinData ? - yes - yes

                        // Misc
                        uiEvents: [],
                        notificationMessage: {
                            milliseconds: 0,
                            color: "",
                            clientId: "", // unnecessary
                            notification: ""
                        },
                        // Inventory
                        clientInventory: presetEmptyInventory,
                        inventoryViewToggle: true,
                        inventoryTop: 456,
                        // HUD
                        level: 0,
                        maxHP: 0,
                        currentHP: 0,
                        maxMP: 0,
                        currentMP: 0,
                        maxXP: 0,
                        currentXP: 0,
                    }
                });
                break;
        }
    }

    public getUIState(): GlobalState {
        return this.rootComponent.getState()
    }

    public handleEvent(e: Event) : void {
        switch(e.type) {
            case EventTypes.POINTER_DOWN:
                if (this.role === ClientRoleTypes.PLAYER) // spectator will have POINTER_DOWN access eventually
                    handlePointerDownEvent(this.rootWidget, e as PointerEvent);
                break;
            case EventTypes.POINTER_UP:
                if (this.role === ClientRoleTypes.PLAYER) // spectator will have POINTER_UP access eventually
                    handlePointerUpEvent(e as PointerEvent);
                break;
            case EventTypes.POINTER_MOVE:
                if (this.role === ClientRoleTypes.PLAYER)
                    handlePointerMoveEvent(e as PointerEvent);
                break;
            case EventTypes.KEY_DOWN:
                if (this.role === ClientRoleTypes.PLAYER)
                    handleKeyDownEvent(this, e as KeyboardEvent);
                break;
            case EventTypes.KEY_UP:
                if (this.role === ClientRoleTypes.PLAYER)
                    handleKeyUpEvent(this, e as KeyboardEvent);
                break;
        }
    }

    private getWorldPosition(ent: Readonly<ClientEntity>): Vector3 {
        const pos = new Vector3(ent.pos.loc.x, ent.pos.loc.y, ent.pos.loc.z);

        const getParent = (e: Readonly<ClientEntity>) => {
            if (!e.parentNetId) return null;
            return this.NetIdToEntityMap[e.parentNetId];
        };
    
        let ancestor = getParent(ent);

        while (ancestor) {
            pos.add(ancestor.pos.loc);
            ancestor = getParent(ancestor);
        }
    
        return pos;
    }

    private updateClientEntPositions(ents: ReadonlyArray<ClientEntity>) {
        ents.forEach(ent => {
            if (ent.sprite && ent.pos) {
                let targetPos = this.getWorldPosition(ent);
                
                if (ent.pos.teleport)
                    ent.sprite.position.copy(targetPos);
                else
                    ent.sprite.position.lerp(targetPos, 0.2);

                if (ent.pos.flipX) { 
                    ent.sprite.scale.x = -1;
                    
                    // if (this.displayHitBoxes) // Don't scale hitbox or nameplate graphics.
                        ent.sprite.children.map(child => child.scale.x = 1.0 / ent.sprite.scale.x);
                }
                else {
                    ent.sprite.scale.x = 1;

                    // if (this.displayHitBoxes) // Don't scale hitbox or nameplate graphics.
                        ent.sprite.children.map(child => child.scale.x = 1.0 / ent.sprite.scale.x);
                }
            
                ent.sprite.rotation.set(0, 0, Math.atan2(ent.pos.dir.y, ent.pos.dir.x));

                // Make sure child is now lerping if parent is.
                if (ent.parentNetId) {
                    if (this.NetIdToEntityMap[ent.parentNetId]) {
                        ent.pos.teleport = this.NetIdToEntityMap[ent.parentNetId].pos.teleport
                    }
                }
            }
        });
    }

    /**
     * @deprecated use entities instead
     */
    private updateClientRenders(renders: ReadonlyArray<ClientRender>) {
        let newRenderList: ClientRender[] = [];
        let rendersToDiscard: ClientRender[] = [];

        renders.forEach(render => {
            if (render.ticks > 0) {
                if (render.sprite && render.pos) {
                    const targetPos = new Vector3(render.pos.loc.x, render.pos.loc.y, render.pos.loc.z);
                    
                    if (render.pos.teleport) {
                        render.sprite.position.copy(targetPos);
                        render.pos.teleport = false
                    }
                    else
                        render.sprite.position.lerp(targetPos, 0.2);
                    
                    if (render.pos.flipX)
                        render.sprite.scale.x = -1; // TODO: Account for hitbox graphics.
                    else
                        render.sprite.scale.x = 1; // TODO: Account for hitbox graphics.
                
                    render.sprite.rotation.set(0, 0, Math.atan2(render.pos.dir.y, render.pos.dir.x));
                }

                render.ticks--;
                newRenderList.push(render);
            }
            else {
                rendersToDiscard.push(render);
            }
        });

        // Remove renders from screen. (or have fade out animation)
        if (rendersToDiscard.length > 0) {
            rendersToDiscard.forEach(render => {
                if (render.sprite) {
                    this.gameScene.remove(render.sprite);
                }
            });
        }

        // Set new render list.
        this.renderList = newRenderList;
    }


    public updateSceneTransitions(transition: SceneTransition) {
        if (transition) {
            if (transition.ticks >= 0) {
                if (transition.pos && transition.sprite) {
                    const targetPos = new Vector3(transition.pos.loc.x, transition.pos.loc.y, transition.pos.loc.z);
                    transition.sprite.position.copy(targetPos);
                }

                transition.ticks--;
                transition.fade.trigger();
            }
            else {
                if (transition.onDone)
                    transition.onDone();

                if (transition.sprite)
                    this.gameScene.remove(transition.sprite);

                transition = undefined;
            }
        }
    }

    private processUIEvents() {
        if (this.getUIState().uiEvents.length > 0) {
            this.getUIState().uiEvents.forEach(uiEvent => {
                switch(uiEvent) {
                    case UIEventTypes.ITEM_EQUIP_EVENT:
                        sendPlayerInventoryEventMessage(this)
                        break;
                    // case ...
                }
            })

            // UI events have been processed, reset the state.
            this.rootComponent.setUIEvents([])
        }
    }

    public render() : void {
        this.updateClientEntPositions(this.entityList);
        // this.updateClientRenders(this.renderList);
        this.updateSceneTransitions(this.sceneTransition);
        centerCameraOnPlayer(this, this.currentPlayerEntity);
        animationSystem(this.entityList, this);
        // animationSystem(this.renderList, this);

        this.renderer.clear();
        this.renderer.render(this.gameScene, this.gameCamera);
        this.renderer.clearDepth();
        this.renderer.render(this.uiScene, this.uiCamera);

        // Render UI updates. // -> set up later
        layoutWidget(this.rootWidget, this);

        // Process UI Events.
        this.processUIEvents()
    }
}