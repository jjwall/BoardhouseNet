import { PlayerEventTypes } from "./playereventtypes";

export interface PlayerMessage {
    eventType: PlayerEventTypes,
    playerId: number
}