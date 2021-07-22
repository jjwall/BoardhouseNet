import { WorldTypes } from "./worldtypes";

export interface Message {
    messageType: MessageTypes;
}

export enum MessageTypes {
    CLIENT_EVENT_MESSAGE = "CLIENT_EVENT_MESSAGE",
    CLIENT_INPUT_MESSAGE = "CLIENT_INPUT_MESSAGE",
    CLIENT_WORLD_MESSAGE = "CLIENT_WORLD_MESSAGE",
    NET_ENTITY_MESSAGE = "NET_ENTITY_MESSAGE",
    NET_ACTION_MESSAGE = "NET_ACTION_MESSAGE",
    NET_WORLD_MESSAGE = "NET_WORLD_MESSAGE",
}