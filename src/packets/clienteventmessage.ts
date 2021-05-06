import { ClientEventTypes } from "./clienteventtypes";
import { Message } from "./message";

export interface ClientEventMessage extends Message {
    eventType: ClientEventTypes,
    clientId: string,
}