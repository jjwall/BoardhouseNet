import { WorldTypes } from "../enums/worldtypes";

export interface ChatMessageData {
    clientId: string; // Only really need if we want to display it.
    clientUsername: string;
    worldType?: WorldTypes; // Not sure this needs to be optional.
    chatMessage: string;
    chatFontColor: string;
}