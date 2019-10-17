import { Entity } from "./entity";
import { GameState } from "./gamestate";
import { PlayerMessage } from "../../packets/playermessage";
import { PlayerEventTypes } from "../../packets/playereventtypes";
import { IBoardhouseBack } from "./interfaces";

export function processMessages(ents: ReadonlyArray<Entity>, boardhouseBack: IBoardhouseBack, state: GameState) {
    console.log(boardhouseBack.messagesToProcess);
    boardhouseBack.messagesToProcess.forEach(message => {
        if (message.eventType === PlayerEventTypes.PLAYER_JOINED) {
            processPlayerJoinedMessage(state)
        }
    })
    boardhouseBack.messagesToProcess = [];
    console.log(boardhouseBack.messagesToProcess);
}

function processPlayerJoinedMessage(state: GameState) {
    console.log("create player entity");
}

function processLeftKeyMessage() {

}

function processRightKeyMessage() {

}