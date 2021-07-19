import { Message } from "./message";
import { WorldTransitionData } from "./worldtransitiondata";

export interface ClientWorldMessage extends Message {
    eventTypes: ClientWorldMessageTypes;
    data: WorldTransitionData;
}

export enum ClientWorldMessageTypes {
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION"
}