import { Entity } from "../states/gameplay/entity";
import { GameState } from "../states/gameplay/gamestate";
import { ClientMessage } from "../../packets/clientmessage";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { IBoardhouseBack } from "../engine/interfaces";
import { initializeControls } from "../components/initializers";
import { sendCreateOrUpdateEntityMessage } from "./sendmessages";

export function processMessages(ents: ReadonlyArray<Entity>, boardhouseBack: IBoardhouseBack, state: GameState) {
    boardhouseBack.messagesToProcess.forEach(message => {
        switch (message.eventType) {
            case ClientEventTypes.PLAYER_JOINED:
                processPlayerJoinedMessage(message, boardhouseBack, state);
                break;
            case ClientEventTypes.SPECTATOR_JOINED:
                processSpectatorJoinedMessage(message, boardhouseBack);
                break;
            case ClientEventTypes.LEFT_KEY_DOWN:
                processLeftKeyDownMessage(ents, message);
                break;
            case ClientEventTypes.LEFT_KEY_UP:
                processLeftKeyUpMessage(ents, message);
                break;
            case ClientEventTypes.RIGHT_KEY_DOWN:
                processRightKeyDownMessage(ents, message);
                break;
            case ClientEventTypes.RIGHT_KEY_UP:
                processRightKeyUpMessage(ents, message);
                break;
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
function processPlayerJoinedMessage(message: ClientMessage, boardhouseBack: IBoardhouseBack, state: GameState) {
    console.log(`(port: ${boardhouseBack.gameServerPort}): client with clientId = "${message.clientId}" joined as a player`);
    console.log("create player entity");
    // Set up player entity.
    // Dummy data...
    let player = new Entity();
    player.player = { id: message.clientId };
    player.pos = { x: 150, y: 150, z: 5 };
    player.sprite = { url: "./data/textures/msknight.png", pixelRatio: 4 };
    player.anim = { sequence: "blah", currentFrame: 0 };
    player.control = initializeControls();

    state.registerEntity(player, boardhouseBack);

    // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        sendCreateOrUpdateEntityMessage(player, boardhouseBack);
    }, 5000);

    // TODO: Loop through NetIdToEnt map and send a bunch of Create Entity messages
}

function processSpectatorJoinedMessage(message: ClientMessage, boardhouseBack: IBoardhouseBack) {
    console.log(`(port: ${boardhouseBack.gameServerPort}): client with clientId = "${message.clientId}" joined as a spectator`);

    // TODO: Loop through NetIdToEnt map and send a bunch of Create Entity messages to create ents for spectating client
}

function processLeftKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.left = true;
            }
        }
    });
}

function processLeftKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.left = false;
            }
        }
    });
}

function processRightKeyDownMessage(ents: ReadonlyArray<Entity>, message: ClientMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.right = true;
            }
        }
    });
}

function processRightKeyUpMessage(ents: ReadonlyArray<Entity>, message: ClientMessage) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                ent.control.right = false;
            }
        }
    });
}