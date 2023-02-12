import { WorldTransitionData } from "../data/worldtransitiondata";
import { NotificationData } from "../data/notificationdata";
import { WorldLevelData } from "../data/worldleveldata";
import { ItemPickupData } from "../data/itempickupdata";
import { Message } from "./message";

export type NetWorldMessage = 
    NetMessageLoadWorld | 
    NetMessageUnloadWorld | 
    NetMessagePlayerWorldTransition |
    NetMessagePlayerItemPickup |
    NetMessagePlayerNotification;

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

export interface NetMessagePlayerNotification extends Message {
    eventType: NetWorldEventTypes.PLAYER_NOTIFICATION;
    data: NotificationData;
}

export enum NetWorldEventTypes {
    LOAD_WORLD = "LOAD_WORLD",
    UNLOAD_WORLD = "UNLOAD_WORLD",
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION",
    PLAYER_ITEM_PICKUP = "PLAYER_ITEM_PICKUP",
    PLAYER_NOTIFICATION = "PLAYER_NOTIFICATION"
}
