import { ClientEventTypes } from "./clienteventtypes";
import { Message } from "./message";
import { WorldTypes } from "./networldmessage";
import { PlayerClassTypes } from "./playerclasstypes";

export interface ClientEventMessage extends Message {
    eventType: ClientEventTypes;
    clientId: string;
    playerClass: PlayerClassTypes;
    worldType: WorldTypes;
}