import { MessageTypes } from "./messagetypes";
import { WorldTypes } from "./worldtypes";

export interface Message {
    messageType: MessageTypes;
    worldType: WorldTypes;
}