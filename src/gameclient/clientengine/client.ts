import { BufferGeometry, ShapeBufferGeometry, WebGLRenderer, Audio, AudioListener, Scene, Camera, Color, OrthographicCamera, Vector3, Mesh } from "three";
import { kenneyFantasy } from "../../modules/tilemapping/tilemaps/kenneyfantasy";
import { UrlToTextureMap, UrlToFontMap, UrlToAudioBufferMap } from "./interfaces";
import { handleKeyDownEvent, handleKeyUpEvent } from "../events/keyboardevents";
import { loadFonts, loadTextures, loadAudioBuffers } from "./loaders";
import { GameServerStateTypes } from "../../packets/gameserverstatetypes";
import { ClientRoleTypes } from "../../packets/clientroletypes";
import { EventTypes } from "../events/eventtypes";
import { ClientEntity } from "./cliententity";
import { NetIdToEntityMap } from "./interfaces";
import { ClientRender } from "../renders/clientrender";
import { PlayerClassTypes } from "../../packets/playerclasstypes";
import { WorldTypes } from "../../packets/worldtypes";

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
        this.keySpaceIsDown = false;
        this.keyUpIsDown = false;
        this.keyDownIsDown = false;

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
    public uiScene: Scene;
    public uiCamera: Camera;
    public entityList: ClientEntity[] = [];
    public NetIdToEntityMap: NetIdToEntityMap = {};
    public renderList: ClientRender[] = [];
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
    keySpaceIsDown: boolean;

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
            loadAudioBuffers(this.audioUrls)
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
            const geometry = new ShapeBufferGeometry(shapes);

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
                this.gameScene.background = new Color("#FFFFFF");

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

    private updateClientEntPositions(ents: ReadonlyArray<ClientEntity>) {
        ents.forEach(ent => {
            if (ent.sprite && ent.pos) {
                const targetPos = new Vector3(ent.pos.loc.x, ent.pos.loc.y, ent.pos.loc.z);
                
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
            }
        });
    }

    private updateClientRenders(renders: ReadonlyArray<ClientRender>) {
        let newRenderList: ClientRender[] = [];
        let rendersToDiscard: ClientRender[] = [];

        renders.forEach(render => {
            if (render.ticks > 0) {
                if (render.sprite && render.pos) {
                    const targetPos = new Vector3(render.pos.loc.x, render.pos.loc.y, render.pos.loc.z);
                    
                    if (render.pos.teleport)
                        render.sprite.position.copy(targetPos);
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

    public centerCamera(client: Client) {
        // Center camera over current Player Entity.
        if (client.currentPlayerEntity) {
            let cx = client.currentPlayerEntity.pos.loc.x;
            let cy = client.currentPlayerEntity.pos.loc.y;

            // Ensure camera doesn't scroll past world edges.
            if (client.worldHeight > 0 && client.worldWidth > 0) {
                cx = Math.max(cx, -client.worldWidth / 2 + client.screenWidth / 2);
                cx = Math.min(cx, client.worldWidth / 2 - client.screenWidth / 2);
        
                cy = Math.max(cy, -client.worldHeight / 2 + client.screenHeight / 2);
                cy = Math.min(cy, client.worldHeight / 2 - client.screenHeight / 2);
            }

            const targetPos = new Vector3(
                cx - client.screenWidth / 2, 
                cy - client.screenHeight / 2, 
                0,
            );

            client.gameCamera.position.lerp(targetPos, 0.2);
        }
    }

    public render() : void {
        this.updateClientEntPositions(this.entityList);
        this.updateClientRenders(this.renderList);
        this.centerCamera(this);

        this.renderer.clear();
        this.renderer.render(this.gameScene, this.gameCamera);
        this.renderer.clearDepth();
        this.renderer.render(this.uiScene, this.uiCamera);

        // Render UI updates. // -> set up later
        // layoutWidget(this.rootWidget, this.engine);
    }
}