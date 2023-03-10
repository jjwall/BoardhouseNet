import { WorldTransitionData } from "../data/worldtransitiondata";
import { ChatMessageData } from "../data/chatmessagedata";
import { WorldJoinData } from "../data/worldjoindata";
import { InventoryData } from "../data/inventorydata";
import { Message } from "./message";

export type ClientWorldMessage =
    ClientMessagePlayerWorldTransition |
    ClientMessageSpectatorWorldJoin |
    ClientMessagePlayerWorldJoin |
    ClientMessageSpectatorWorldTransition |
    ClientMessagePlayerInventoryEvent | 
    ClientMessagePlayerChatMessage
;

export interface ClientMessagePlayerWorldJoin extends Message {
    eventType: ClientWorldEventTypes.PLAYER_WORLD_JOIN;
    data: WorldJoinData;
}

export interface ClientMessageSpectatorWorldJoin extends Message {
    eventType: ClientWorldEventTypes.SPECTATOR_WORLD_JOIN;
    data: WorldJoinData;
}

export interface ClientMessagePlayerWorldTransition extends Message {
    eventType: ClientWorldEventTypes.PLAYER_WORLD_TRANSITION;
    data: WorldTransitionData; // need something more specific to client?
}

export interface ClientMessageSpectatorWorldTransition extends Message {
    eventType: ClientWorldEventTypes.SPECTATOR_WORLD_TRANSITION;
    data: WorldTransitionData; // need something more specific to client?
}

export interface ClientMessagePlayerInventoryEvent extends Message {
    eventType: ClientWorldEventTypes.PLAYER_INVENTORY_EVENT
    data: InventoryData
}

export interface ClientMessagePlayerChatMessage extends Message {
    eventType: ClientWorldEventTypes.PLAYER_CHAT_MESSAGE
    data: ChatMessageData
}

export enum ClientWorldEventTypes {
    PLAYER_WORLD_JOIN = "PLAYER_WORLD_JOIN",
    SPECTATOR_WORLD_JOIN = "SPECTATOR_WORLD_JOIN",
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION",
    SPECTATOR_WORLD_TRANSITION = "SPECTATOR_WORLD_TRANSITION",
    PLAYER_INVENTORY_EVENT = "PLAYER_INVENTORY_EVENT",
    PLAYER_CHAT_MESSAGE = "PLAYER_CHAT_MESSAGE",
}