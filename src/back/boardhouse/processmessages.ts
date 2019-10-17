import { Entity } from "./entity";
import { GameState } from "./gamestate";
import { PlayerMessage } from "../../packets/playermessage";
import { PlayerEventTypes } from "../../packets/playereventtypes";
import { IBoardhouseBack } from "./interfaces";
import { initializeControls } from "./initializers";
import { sendCreateOrUpdateEntityMessage } from "./sendmessages";

export function processMessages(ents: ReadonlyArray<Entity>, boardhouseBack: IBoardhouseBack, state: GameState) {
    boardhouseBack.messagesToProcess.forEach(message => {
        if (message.eventType === PlayerEventTypes.PLAYER_JOINED) {
            processPlayerJoinedMessage(message, boardhouseBack, state);
        }
    });

    boardhouseBack.messagesToProcess = [];
}

/**
 * Just because player joins, doesn't mean an ent necessarily needs to be created for them.
 * In this example we do just that.
 * @param message 
 * @param boardhouseBack 
 * @param state 
 */
function processPlayerJoinedMessage(message: PlayerMessage, boardhouseBack: IBoardhouseBack, state: GameState) {
    console.log("create player entity");
    // Set up player entity.
    let player = new Entity();
    player.playerId = message.playerId;
    player.pos = { x: 500, y: 300 };
    player.sprite = { url: "./data/textures/msknight.png", pixelRatio: 4 };
    player.anim = { sequence: "blah", currentFrame: 0 };
    player.control = initializeControls();

    state.registerEntity(player, boardhouseBack);

    // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        sendCreateOrUpdateEntityMessage(player, boardhouseBack);
    }, 5000);
}

function processLeftKeyMessage() {

}

function processRightKeyMessage() {

}