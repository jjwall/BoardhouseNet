import { Message } from "./message";
import { WorldTransitionData } from "./worldtransitiondata";

export interface ClientWorldMessage extends Message {
    eventTypes: ClientWorldEventTypes;
    data: WorldTransitionData;
}

export enum ClientWorldEventTypes {
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION"
}