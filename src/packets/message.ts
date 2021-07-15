import { MessageTypes } from "./messagetypes";
import { WorldTypes } from "./networldmessage";

export interface Message {
    messageType: MessageTypes;
    worldType: WorldTypes;
}