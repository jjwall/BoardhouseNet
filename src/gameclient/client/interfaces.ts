import { Texture, Font, Scene, Camera } from "three";

// not used on front end
// export interface RegistryKeyToSystemMap {
//     [key: string]: (ents: ReadonlyArray<Object>, state: BaseState) => void;
// }

// not used on front end
// export interface RegistryKeyToEntityListMap {
//     [key: string]: Array<Object>;
// }

export interface UrlToTextureMap {
    [url: string]: Texture;
}

export interface UrlToFontMap {
    [url: string]: Font;
}

export interface UrlToAudioBufferMap {
    [url: string]: AudioBuffer;
}