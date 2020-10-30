import { ClientEventTypes } from "./clienteventtypes";

export interface ClientMessage {
    eventType: ClientEventTypes,
    clientId: number
}