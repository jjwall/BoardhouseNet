import { BufferGeometry, ShapeBufferGeometry, WebGLRenderer, Audio, AudioListener, Scene, Camera, Color, OrthographicCamera, Vector2, Vector3, PlaneGeometry, Mesh, NearestFilter, MeshBasicMaterial, BufferAttribute } from "three";
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

export interface ClientConfig {
    /// state stuff ///



    /// end state stuff ///
    role: ClientRoleTypes;
    playerClass: PlayerClassTypes;
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
    // displayHitBoxes: boolean; // -> set up later
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
        // this.displayHitBoxes = config.displayHitBoxes;
        // this.globalErrorHandling = config.globalErrorHandling;
        this.fontUrls = config.fontUrls;
        this.textureUrls = config.textureUrls;
        this.audioUrls = config.audioUrls;
    }

    /// state stuff
    public role: ClientRoleTypes;
    public playerClass: PlayerClassTypes;
    public gameScene: Scene;
    public gameCamera: Camera;
    public uiScene: Scene;
    public uiCamera: Camera;
    public entityList: ClientEntity[] = [];
    public NetIdToEntityMap: NetIdToEntityMap = {};
    public renderList: ClientRender[] = [];

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

                // Set up initial tilemap.
                this.renderTileMap();
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
                    ent.sprite.position.lerp(targetPos, 0.2)
            
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
                        render.sprite.position.lerp(targetPos, 0.2)
                
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
            })
        }

        // Set new render list.
        this.renderList = newRenderList;
    }

    // Render one time when level loads.
    private renderTileMap() {
        const tileTextureMap = this.getTexture("./data/textures/colored_packed.png");
        const tileHeight = 16; // in pixels
        const tileWidth = 16; // in pixels
        const pixelRatio = 8;
        const canvasWidth = 48; // # of tiles wide
        const canvasHeight = 22; // # of tiles high
        const scaledHeight = tileHeight*pixelRatio;
        const scaledWidth = tileWidth*pixelRatio;
        const uMultiple = tileWidth / (canvasWidth * tileWidth); //16 / 768;
        const vMultiple = tileHeight / (canvasHeight * tileHeight); //16 / 352;
        // Set magFilter to nearest for crisp looking pixels/
        tileTextureMap.magFilter = NearestFilter;

        kenneyFantasy.layers.forEach(layer => {
            layer.tiles.forEach(tile => {
                const tileNumber = tile.tile;
                const posX = tile.x*scaledWidth + scaledWidth/2;
                const posY = scaledHeight*canvasHeight - tile.y*scaledHeight + scaledHeight/2;
                const v = canvasHeight - Math.floor(tileNumber / canvasWidth) - 1;
                const u = tileNumber % canvasWidth;
                const material = new MeshBasicMaterial({ map: tileTextureMap, transparent: true });
                const geometry = new BufferGeometry();
                // "8" comes from tile width or height divided by 2.
                const positions = new Float32Array([
                    -8, 8, 0,
                    8, 8, 0,
                    -8, -8, 0,
                    8, -8, 0,
                    -8, -8, 0,
                    8, 8, 0,
                ]).map(x => x * pixelRatio);
                const uvs = new Float32Array([
                    u*uMultiple, (v+1)*vMultiple,
                    (u+1)*uMultiple, (v+1)*vMultiple,
                    (u)*uMultiple, (v)*vMultiple,
                    (u+1)*uMultiple, (v)*vMultiple,
                    (u)*uMultiple, (v)*vMultiple,
                    (u+1)*uMultiple, (v+1)*vMultiple,
                ]);
                const normals = new Float32Array([
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                ]);

                geometry.setAttribute('position', new BufferAttribute(positions, 3));
                geometry.setAttribute('normal', new BufferAttribute(normals, 3));
                geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
                geometry.setIndex([0, 2, 1, 1, 2, 3]);

                const tileMesh = new Mesh(geometry, material);
                const position = new Vector3(posX, posY, 1);
                tileMesh.position.copy(position);
                this.gameScene.add(tileMesh);            
            });
        });
    }

    public render() : void {
        this.updateClientEntPositions(this.entityList);
        this.updateClientRenders(this.renderList);

        this.renderer.clear();
        this.renderer.render(this.gameScene, this.gameCamera);
        this.renderer.clearDepth();
        this.renderer.render(this.uiScene, this.uiCamera);

        // Render UI updates. // -> set up later
        // layoutWidget(this.rootWidget, this.engine);
    }
}