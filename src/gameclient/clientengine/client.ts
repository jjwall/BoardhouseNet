import { BufferGeometry, ShapeGeometry, WebGLRenderer, Audio, AudioListener, Scene, Camera, Color, OrthographicCamera, Vector3, Mesh, Group } from "three";
import { UrlToTextureMap, UrlToFontMap, UrlToAudioBufferMap } from "./interfaces";
import { handleKeyDownEvent, handleKeyUpEvent } from "../events/keyboardevents";
import { loadFonts, loadTextures, loadAudioBuffers, loadFairyGUIAssets } from "./loaders";
import { GameServerStateTypes } from "../../packets/enums/gameserverstatetypes";
import { ClientRoleTypes } from "../../packets/enums/clientroletypes";
import { EventTypes } from "../events/eventtypes";
import { ClientEntity } from "./cliententity";
import { NetIdToEntityMap } from "./interfaces";
import { ClientRender } from "../renders/clientrender";
import { PlayerClassTypes } from "../../packets/enums/playerclasstypes";
import { WorldTypes } from "../../packets/enums/worldtypes";
import { SceneTransition } from "../renders/scenetransitions";
import { animationSystem } from "../systems/animation";
import { centerCameraOnPlayer } from "./camera";
import * as fgui from "fairygui-three";

export interface ClientConfig {
    /// state stuff ///



    /// end state stuff ///
    role: ClientRoleTypes;
    playerClass: PlayerClassTypes;
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
        this.worldType = config.worldType;
        ///
        // vvv merged from old configs vvv
        this.connection = config.connection;
        this.currentPort = config.currentPort;
        this.currentClientId = config.currentClientId;
        this.hostName = config.hostName;
        this.keyLeftIsDown = false;
        this.keyRightIsDown = false;
        this.keyUpIsDown = false;
        this.keyDownIsDown = false;
        this.keyZIsDown = false;
        this.keyXIsDown = false;

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
    public gameScene: Scene;
    public gameCamera: Camera;
    public uiView: fgui.GObject
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

    /// ^^^ old configs ^^^

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
            loadAudioBuffers(this.audioUrls),
            loadFairyGUIAssets('./ui/MainMenu')
        ]).then((assets) => {
            this.setFonts(assets[0]);
            this.setTextures(assets[1]);
            this.setAudioBuffers(assets[2]);
        });
    }

    public getFont(url: string) {
        if (!this._fonts[url]) {
            throw new Error("Font not found. Check url and ensure font url is being passed in to loadFonts().");
        }

        return this._fonts[url];
    }

    public getTexture(url: string) {
        if (!this._textures[url]) {
            throw new Error("Texture not found. Check url and ensure texture url is being passed in to loadTextures().");
        }

        return this._textures[url];
    }

    public getAudioBuffer(url: string) {
        if (!this._audioBuffers[url]) {
            throw new Error("Audio element not found. Check url and ensure audio element url is being passed in to loadAudioElements().");
        }

        return this._audioBuffers[url];
    }

    public getTextGeometry(contents: string, fontUrl: string, font_size: number) {
        const key = `${contents}|${fontUrl}|${font_size}`;
        const geom = this._textGeometries[key];
        if (geom) {
            return geom;
        } else {
            const font = this.getFont(fontUrl);
            const shapes = font.generateShapes(contents, font_size);
            const geometry = new ShapeGeometry(shapes);

            // Ensure font is centered on (parent) widget.
            geometry.computeBoundingBox();
            const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            geometry.translate(xMid, 0, 0);

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
                this.gameScene.background = new Color("#000000");

                // Set up game camera.
                this.gameCamera = new OrthographicCamera(0, this.screenWidth, this.screenHeight, 0, -1000, 1000);

                // Set up ui scene.
                this.uiScene = new Scene();

                // Set up ui camera.
                this.uiCamera = new OrthographicCamera(0, this.screenWidth, 0, -this.screenHeight, -1000, 1000);
                break;
        }
    }

    public handleEvent(e: Event) : void {
        switch(e.type) {
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
                    
                    if (this.displayHitBoxes) // Don't scale hitbox graphics.
                        ent.sprite.children.map(child => child.scale.x = 1.0 / ent.sprite.scale.x);
                }
                else {
                    ent.sprite.scale.x = 1;

                    if (this.displayHitBoxes) // Don't scale hitbox graphics.
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

    public initUI() {
        console.log(this.renderer.domElement)
        fgui.Stage.init(this.renderer, { screenMode:'horizontal' });  //screenMode is optional if you dont want to rotate the screen 
        fgui.Stage.scene = this.uiScene
        // fgui.Stage.camera = this.uiCamera
    
        // fgui.UIPackage.loadPackage('./ui/ui').then(()=> {
            this.uiView = fgui.UIPackage.createObject("MainMenu", "Main");
            // this.uiView = fgui.UIPackage.createObject("Package1", "Component1");
            // this.uiView.makeFullScreen();
            // fgui.UIContentScaler.scaleWithScreenSize(this.screenWidth, this.screenHeight, fgui.ScreenMatchMode.MatchWidth);
            // fgui.GRoot.inst.addChild(this.uiView);
            this.uiView.displayObject.camera = this.uiCamera;
            this.uiView.displayObject.setLayer(0);
    
            let container = new Group();
            // fgui.UIContentScaler.scaleWithScreenSize(this.screenWidth, this.screenHeight, fgui.ScreenMatchMode.MatchWidthOrHeight);
            container.scale.set(0.5, 0.5, 0.5);
            container.add(this.uiView.obj3D);
            this.uiScene.add(container);
        // });
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
        fgui.Stage.update();
        this.renderer.render(this.uiScene, this.uiCamera);
        // this.renderer.render(this.uiScene, this.uiCamera);

        // Render UI updates. // -> set up later
        // layoutWidget(this.rootWidget, this.engine);
    }
}