import { Texture, Font, Scene, Camera } from "three";
import { ClientEntity } from "./cliententity";

export interface NetIdToEntityMap {
    [netId: number]: ClientEntity;
}

export interface UrlToTextureMap {
    [url: string]: Texture;
}

export interface UrlToFontMap {
    [url: string]: Font;
}

export interface UrlToAudioBufferMap {
    [url: string]: AudioBuffer;
}