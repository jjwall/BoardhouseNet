import { MessageTypes } from "../../packets/messagetypes";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { ClientEventMessage } from "../../packets/clienteventmessage";
import { Client } from "../client/client";
import { ClientInputMessage } from "../../packets/clientinputmessage";
import { ClientInputTypes } from "../../packets/clientinputtypes";

// keyboard controls
// visit https://keycode.info/ for other key codes.
export let handleKeyDownEvent = (client: Client, e: KeyboardEvent) => {
    let message: ClientEventMessage;

    switch(e.keyCode) {
        case 37: // left
        case 65: // a
            if (!client.keyLeftIsDown) {
                message  = {
                    messageType: MessageTypes.CLIENT_EVENT_MESSAGE,
                    eventType: ClientEventTypes.LEFT_KEY_DOWN,
                    clientId: client.currentClientId
                }

                client.keyLeftIsDown = true;
                client.connection.send(JSON.stringify(message));
            }
            break;

        case 39: // right
        case 68: // d
            if (!client.keyRightIsDown) {
                message = {
                    messageType: MessageTypes.CLIENT_EVENT_MESSAGE,
                    eventType: ClientEventTypes.RIGHT_KEY_DOWN,
                    clientId: client.currentClientId
                }
                
                client.keyRightIsDown = true;
                client.connection.send(JSON.stringify(message));
            }
            break;

        case 38: // up
        case 87: // w
            // state.getEntitiesByKey<Entity>("control").forEach(ent=> {
            //     if (ent.control) {
            //         ent.control.up = true;
            //     }
            // });
            break;
        
        case 40: // down
        case 83: // s
            // state.getEntitiesByKey<Entity>("control").forEach(ent=> {
            //     if (ent.control) {
            //         ent.control.down = true;
            //     }
            // });
            break;

        case 32: // spacebar
        case 90: // z
            // state.getEntitiesByKey<Entity>("control").forEach(ent=> {
            //     if (ent.control) {
            //         ent.control.attack = true;
            //     }
            // });
            if (!client.keySpaceIsDown) {
                let inputMessage: ClientInputMessage = {
                    messageType: MessageTypes.CLIENT_INPUT_MESSAGE,
                    inputType: ClientInputTypes.ATTACK,
                    clientId: client.currentClientId
                }
                
                client.keySpaceIsDown = true;
                console.log("SPACE - Z - ATTACK");
                client.connection.send(JSON.stringify(inputMessage));
            }
            break;
    }
}

export function handleKeyUpEvent(client: Client, e: KeyboardEvent) {
    let message: ClientEventMessage;

    switch(e.keyCode) {
        case 37: // left
        case 65: // a
            if (client.keyLeftIsDown) {
                message = {
                    messageType: MessageTypes.CLIENT_EVENT_MESSAGE,
                    eventType: ClientEventTypes.LEFT_KEY_UP,
                    clientId: client.currentClientId
                }
                
                client.keyLeftIsDown = false;
                client.connection.send(JSON.stringify(message));
            }
            break;

        case 39: // right
        case 68: // d
            if (client.keyRightIsDown) {
                message = {
                    messageType: MessageTypes.CLIENT_EVENT_MESSAGE,
                    eventType: ClientEventTypes.RIGHT_KEY_UP,
                    clientId: client.currentClientId
                }
                
                client.keyRightIsDown = false;
                client.connection.send(JSON.stringify(message));
            }
            break;

        case 38: // up
        case 87: // w
            // state.getEntitiesByKey<Entity>("control").forEach(ent=> {
            //     if (ent.control) {
            //         ent.control.up = false;
            //     }
            // });
            break;
        
        case 40: // down
        case 83: // s
            // state.getEntitiesByKey<Entity>("control").forEach(ent=> {
            //     if (ent.control) {
            //         ent.control.down = false;
            //     }
            // });
            break;

        case 32: // spacebar
        case 90: // z
            // state.getEntitiesByKey<Entity>("control").forEach(ent=> {
            //     if (ent.control) {
            //         ent.control.attack = false;
            //     }
            // });
            if (client.keySpaceIsDown) {
                client.keySpaceIsDown = false;
            }

            break;
    }
}