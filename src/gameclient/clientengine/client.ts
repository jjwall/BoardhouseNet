import { BufferGeometry, ShapeGeometry, WebGLRenderer, Audio, AudioListener, Scene, Camera, Color, OrthographicCamera, Vector3, Mesh } from "three";
import { handlePointerDownEvent, handlePointerMoveEvent, handlePointerUpEvent } from "../events/pointerevents";
import { sendPlayerChatMessage, sendPlayerInventoryEventMessage } from "../messaging/sendclientworldmessages";
import { globalGameContext, GlobalGameState } from "../ui/store/context/globalgamecontext";
import { UrlToTextureMap, UrlToFontMap, UrlToAudioBufferMap } from "./interfaces";
import { handleKeyDownEvent, handleKeyUpEvent } from "../events/keyboardevents";
import { renderGamePlayUi, GameplayRoot } from "../ui/states/gameplay/rootui";
import { chatInputBoxSlice } from "../ui/store/features/chatinputboxslice";
import { UIStateTypes } from "../../packets/enums/gameserverstatetypes";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { loadFonts, loadTextures, loadAudioBuffers } from "./loaders";
import { ClientRoleTypes } from "../../packets/enums/clientroletypes";
import { renderTitleScreenUi } from "../ui/states/titlescreen/rootui";
import { renderMainMenuUi } from "../ui/states/mainmenu/rootui";
import { SceneTransition } from "../renders/scenetransitions";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { createWidget, Widget } from "../ui/core/widget";
import { ClientRender } from "../renders/clientrender";
import { animationSystem } from "../systems/animation";
import { layoutWidget } from "../ui/core/layoutwidget";
import { ItemData } from "../../packets/data/itemdata";
import { EventTypes } from "../events/eventtypes";
import { NetIdToEntityMap } from "./interfaces";
import { centerCameraOnPlayer } from "./camera";
import { ClientEntity } from "./cliententity";

// let currentContext = null;
// let currentRootComponent = MainMenu;

// function setUIGameContext(data) {
//     currentContext = data;
//     react.render(<currentRootComponent gameContext={currentContext} />);
// }

// function switchRoot(component) {
//     currentRootComponent = component;
//     react.render(<currentRootComponent gameContext={currentContext} />;
// }

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
        this.chatKeyPressed = false;

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
    public uiState: UIStateTypes;
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
    chatKeyPressed: boolean;

    /// ^^^ old configs ^^^
    public currentContext: any = null
    public currentRootRender: any
    public rootComponent: any
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
     * Initialize Game Client
     */
    public initializeClient(uiState: UIStateTypes) {
        console.log("initializing client");

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

        // Initialize UI State.
        this.setUIState(UIStateTypes.TITLE_SCREEN);
    }

    public setUIGameContext(data: any) {
        this.currentContext = data;
        // this.uiScene.remove(this.rootWidget); // good for swapping
        // this.uiScene.add(this.rootWidget);
        this.currentRootRender(this.uiScene, this.rootWidget, { globalGameState: this.currentContext })
    }

    /** Note: This really shouldn't be used... */
    public getUIGameContext(): GlobalGameState {
        return this.currentContext
    }

    private setUIState(uiState: UIStateTypes) {
        this.uiState = uiState

        switch (uiState) {
            case UIStateTypes.TITLE_SCREEN:
                this.currentRootRender = renderTitleScreenUi
                this.currentContext = globalGameContext
                this.rootComponent = this.currentRootRender(this.uiScene, this.rootWidget, { globalGameState: this.currentContext })
                break;
            case UIStateTypes.GAMEPLAY:
                this.currentRootRender = renderGamePlayUi
                this.currentContext = globalGameContext
                this.currentContext.onChatSubmit = this.onChatSubmit // Note: Might be a better way to do this...
                this.currentContext.onItemEquip = this.onItemEquip
                this.rootComponent = this.currentRootRender(this.uiScene, this.rootWidget, { globalGameState: this.currentContext })
                break;
            case UIStateTypes.MAIN_MENU:
                this.currentRootRender = renderMainMenuUi
                this.currentContext = globalGameContext
                this.currentContext.onPlay = this.onPlay
                this.rootComponent = this.currentRootRender(this.uiScene, this.rootWidget, { globalGameState: this.currentContext })
                break;
        }
    }

    public handleEvent(e: Event) : void {
        switch (this.uiState) {
            case UIStateTypes.GAMEPLAY:
                this.handleGamePlayEvent(e);
                break;
            case UIStateTypes.MAIN_MENU:
                this.handleMainMenuEvent(e);
                break;
            case UIStateTypes.TITLE_SCREEN:
                this.handleTitleScreenEvent(e);
                break;
        }
    }

    private handleMainMenuEvent(e: Event) {
        switch(e.type) {
            case EventTypes.POINTER_DOWN:
                handlePointerDownEvent(this.rootWidget, e as PointerEvent);
                break;
            case EventTypes.POINTER_UP:
                handlePointerUpEvent(e as PointerEvent);
                break;
            case EventTypes.POINTER_MOVE:
                handlePointerMoveEvent(e as PointerEvent);
                break;
        }
    }

    private handleTitleScreenEvent(e: Event) {
        switch(e.type) {
            case EventTypes.KEY_DOWN:
            case EventTypes.POINTER_DOWN:
                // this.setUIState(UIStateTypes.MAIN_MENU) // TODO: Flesh main menu out. Current lobby system is fine for development for now.
                this.setUIState(UIStateTypes.GAMEPLAY)
                break
        }
    }

    private handleGamePlayEvent(e: Event) {
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
                if (this.role === ClientRoleTypes.PLAYER) {
                    if (!this.getUIGameContext().chatFocused)
                        handleKeyDownEvent(this, e as KeyboardEvent);
                    else
                        chatInputBoxSlice.setKeystroke((e as KeyboardEvent).key)

                        // this.rootComponent.updateChatInputBoxContents((e as KeyboardEvent).key);
                    
                    // Edge case for handling chat focus key.
                    if ((e as KeyboardEvent).code === 'Enter')
                        handleKeyDownEvent(this, e as KeyboardEvent);
                }
                break;
            case EventTypes.KEY_UP:
                if (this.role === ClientRoleTypes.PLAYER && !this.getUIGameContext().chatFocused)
                    handleKeyUpEvent(this, e as KeyboardEvent);

                // Edge case for handling chat focus key.
                if ((e as KeyboardEvent).code === 'Enter')
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

    public onPlay = () => {
        this.setUIState(UIStateTypes.GAMEPLAY)
    }

    public onChatSubmit = (contents: string) => {
        sendPlayerChatMessage(this, contents);
    }

    public onItemEquip = (newInventory: ItemData[]) => {
        sendPlayerInventoryEventMessage(this, newInventory);
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

        // Render UI updates.
        layoutWidget(this.rootWidget, this);
    }
}