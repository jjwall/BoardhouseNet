import { Entity } from "../states/gameplay/entity";
import { GameState } from "../states/gameplay/gamestate";
import { ClientMessage } from "../../packets/clientmessage";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { initializeControls } from "../components/initializers";
import { sendCreateEntitiesMessage } from "./sendmessages";
import { Server } from "./../server/server";

export function processMessages(ents: ReadonlyArray<Entity>, server: Server, state: GameState) {
    server.messagesToProcess.forEach(message => {
        switch (message.eventType) {
            case ClientEventTypes.PLAYER_JOINED:
                processPlayerJoinedMessage(message, server, state);
                break;
            case ClientEventTypes.SPECTATOR_JOINED:
                processSpectatorJoinedMessage(message, server, state);
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
            case ClientEventTypes.INPUT_TO_QUERY:
                processQueryInputMessage(ents, message, server);
                break;
        }
    });

    server.messagesToProcess = [];
}

/**
 * Just because player joins, doesn't mean an ent necessarily needs to be created for them.
 * In this example we do just that.
 * @param message 
 * @param server 
 * @param state 
 */
function processPlayerJoinedMessage(message: ClientMessage, server: Server, state: GameState) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.clientId}" joined as a player`);
    console.log("create player entity");
    // Set up player entity.
    // Dummy data...
    let player = new Entity();
    player.player = { id: message.clientId };
    player.pos = { x: 150, y: 150, z: 5 };
    player.sprite = { url: "./data/textures/msknight.png", pixelRatio: 4 };
    // player.anim = { sequence: "blah", currentFrame: 0 };
    player.control = initializeControls();

    state.registerEntity(player, server);

    // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        // Create all entities for connecting client.
        sendCreateEntitiesMessage(state.getEntitiesByKey<Entity>("global"), server);
    }, 5000);

    // TODO: Loop through NetIdToEnt map and send a bunch of Create Entity messages
}

function processSpectatorJoinedMessage(message: ClientMessage, server: Server, state: GameState) {
    console.log(`(port: ${server.gameServerPort}): client with clientId = "${message.clientId}" joined as a spectator`);

    // Dummy data... for testing stuff with spectator
    // Set up another player entity.
    let player = new Entity();
    player.player = { id: message.clientId };
    player.pos = { x: 350, y: 150, z: 5 };
    player.sprite = { url: "./data/textures/snow.png", pixelRatio: 4 };
    player.anim = { sequence: "blah", currentFrame: 0 };
    player.control = initializeControls();

    state.registerEntity(player, server);

    // Not exactly sure why we need this setTimeout here.
    setTimeout(function() {
        // Create all entities for connecting client.
        sendCreateEntitiesMessage(state.getEntitiesByKey<Entity>("global"), server);
    }, 5000);

    // TODO: Loop through NetIdToEnt map and send a bunch of Create Entity messages to create ents for spectating client
}

function processQueryInputMessage(ents: ReadonlyArray<Entity>, message: ClientMessage, server: Server) {
    ents.forEach(ent => {
        if (ent.player && ent.control) {
            if (ent.player.id === message.clientId) {
                server.queriedInputs.push({input: "myInput", clientId: message.clientId});
            }
        }
    });
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