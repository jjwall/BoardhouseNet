import { Message } from "./message";
import { WorldTransitionData } from "./worldtransitiondata";

export type ClientWorldMessage =
    ClientMessagePlayerWorldTransition
;

export interface ClientMessagePlayerWorldTransition extends Message {
    eventType: ClientWorldEventTypes.PLAYER_WORLD_TRANSITION;
    data: WorldTransitionData; // need something more specific to client?
}

export enum ClientWorldEventTypes {
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION"
}