import { WorldTransitionData } from "../data/worldtransitiondata";
import { NotificationData } from "../data/notificationdata";
import { ChatMessageData } from "../data/chatmessagedata";
import { WorldLevelData } from "../data/worldleveldata";
import { ItemPickupData } from "../data/itempickupdata";
import { InventoryData } from "../data/inventorydata";
import { Message } from "./message";

export type NetWorldMessage = 
    NetMessageLoadWorld | 
    NetMessageUnloadWorld | 
    NetMessagePlayerWorldTransition |
    NetMessagePlayerItemPickup |
    NetMessagePlayerReconcileInventory |
    NetMessagePlayerNotification |
    NetMessagePlayerChatMessage;

export interface NetMessageLoadWorld extends Message {
    eventType: NetWorldEventTypes.LOAD_WORLD;
    data: WorldLevelData;
}

export interface NetMessageUnloadWorld extends Message {
    eventType: NetWorldEventTypes.UNLOAD_WORLD;
}

export interface NetMessagePlayerWorldTransition extends Message {
    eventType: NetWorldEventTypes.PLAYER_WORLD_TRANSITION;
    data: WorldTransitionData;
}

export interface NetMessagePlayerItemPickup extends Message {
    eventType: NetWorldEventTypes.PLAYER_ITEM_PICKUP;
    data: ItemPickupData;
}

export interface NetMessagePlayerReconcileInventory extends Message {
    eventType: NetWorldEventTypes.PLAYER_RECONCILE_INVENTORY;
    data: InventoryData;
}

export interface NetMessagePlayerNotification extends Message {
    eventType: NetWorldEventTypes.PLAYER_NOTIFICATION;
    data: NotificationData;
}

export interface NetMessagePlayerChatMessage extends Message {
    eventType: NetWorldEventTypes.PLAYER_CHAT_MESSAGE,
    data: ChatMessageData
}

export enum NetWorldEventTypes {
    LOAD_WORLD = "LOAD_WORLD",
    UNLOAD_WORLD = "UNLOAD_WORLD",
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION",
    PLAYER_ITEM_PICKUP = "PLAYER_ITEM_PICKUP",
    PLAYER_RECONCILE_INVENTORY = "PLAYER_RECONCILE_INVENTORY",
    PLAYER_NOTIFICATION = "PLAYER_NOTIFICATION",
    PLAYER_CHAT_MESSAGE = "PLAYER_CHAT_MESSAGE",
}
