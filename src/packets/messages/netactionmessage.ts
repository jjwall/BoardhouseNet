import { EntityData } from "../data/entitydata";
import { Message } from "./message";
import { WorldTypes } from "../enums/worldtypes";

export type NetActionMessage =
    NetMessagePlayerAttackDisplay
;

export interface NetMessagePlayerAttackDisplay extends Message {
    eventType: NetActionEventTypes.PLAYER_ATTACK_ANIM_DISPLAY;
    data: {
        worldType: WorldTypes;
        ents: EntityData[];  // will use Entity Data to display anims (for now)
    }
}

export enum NetActionEventTypes {
    PLAYER_ATTACK_ANIM_DISPLAY = "PLAYER_ATTACK_ANIM_DISPLAY",
    // ...
}