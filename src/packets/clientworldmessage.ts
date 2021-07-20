import { Message } from "./message";
import { WorldTransitionData } from "./worldtransitiondata";

export type ClientWorldMessage =
    MessagePlayerWorldTransition
;

// Rename to ClientMessagePlayerWorldTransition?
export interface MessagePlayerWorldTransition extends Message {
    eventType: ClientWorldEventTypes.PLAYER_WORLD_TRANSITION;
    data: WorldTransitionData; // need something more specific to client?
}

export enum ClientWorldEventTypes {
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION"
}