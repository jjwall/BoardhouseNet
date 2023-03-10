import { WorldTypes } from "../enums/worldtypes";

export interface ChatMessageData {
    clientId: string; // may not need
    clientUsername: string;
    worldType?: WorldTypes;
    chatMessage: string;
}