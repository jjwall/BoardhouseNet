import { Texture, Font, Scene, Camera } from "three";

// export interface RegistryKeyToSystemMap {
//     [key: string]: (ents: ReadonlyArray<Object>, state: BaseState) => void;
// }

// export interface RegistryKeyToEntityListMap {
//     [key: string]: Array<Object>;
// }

export interface UrlToTextureMap {
    [url: string]: Texture;
}

export interface UrlToFontMap {
    [url: string]: Font;
}

export interface UrlToAudioMap {
    [url: string]: HTMLAudioElement;
}

export interface IBoardHouseFront {
    connection: WebSocket;
    currentPort: number;
    currentLoginUserId: number;
    hostName: string;
    gameScene: Scene;
    gameCamera: Camera;
    keyLeftIsDown: boolean;
    keyRightIsDown: boolean;
}