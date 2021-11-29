import { EntityData } from "../data/entitydata";
import { Message } from "./message";
import { WorldTypes } from "../enums/worldtypes";

export type NetActionMessage =
    NetMessagePlayerAttackDisplay
;

// Should be called NetMessageRender
export interface NetMessagePlayerAttackDisplay extends Message {
    eventType: NetActionEventTypes.PLAYER_ATTACK_ANIM_DISPLAY;
    // need to have a proper data struct, what's in what's out
    data: {
        worldType: WorldTypes;
        ents: EntityData[];  // will use Entity Data to display anims (for now)
        entDoingActionNetId: number;
        renderDuration: number; // should be in milliseconds, currently processed as animation frame ticks
        renderTracksCaster: boolean;
        offsetPosX: number;
        offsetPosY: number;
    }
}

export enum NetActionEventTypes {
    PLAYER_ATTACK_ANIM_DISPLAY = "PLAYER_ATTACK_ANIM_DISPLAY",
    RENDER_PLAYER_SKILL = "RENDER_PLAYER_SKILL"
    // ...
}