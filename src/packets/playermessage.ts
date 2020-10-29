import { ClientEventTypes } from "./clienteventtypes";

export interface PlayerMessage {
    eventType: ClientEventTypes,
    playerId: number // clientId, loginUserId should also be clientId
}