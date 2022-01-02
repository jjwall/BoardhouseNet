import { sendDownKeyUpMessage, sendDownKeyDownMessage, sendLeftKeyDownMessage, sendLeftKeyUpMessage, sendRightKeyDownMessage, sendRightKeyUpMessage, sendUpKeyDownMessage, sendUpKeyUpMessage, sendSkillOneReleaseMessage, sendSkillTwoReleaseMessage, sendSkillOnePressMessage, sendSkillTwoPressMessage } from "../messaging/sendclientinputmessages";
import { Client } from "../clientengine/client";

// keyboard controls
// visit https://keycode.info/ for other key codes.
export let handleKeyDownEvent = (client: Client, e: KeyboardEvent) => {
    switch(e.keyCode) {
        case 37: // left
        case 65: // a
            if (!client.keyLeftIsDown) {
                client.keyLeftIsDown = true;
                sendLeftKeyDownMessage(client);
            }
            break;

        case 39: // right
        case 68: // d
            if (!client.keyRightIsDown) {
                client.keyRightIsDown = true;
                sendRightKeyDownMessage(client);
            }
            break;

        case 38: // up
        case 87: // w
            if (!client.keyUpIsDown) {
                client.keyUpIsDown = true;
                sendUpKeyDownMessage(client);
            }
            break;
        
        case 40: // down
        case 83: // s
            if (!client.keyDownIsDown) {
                client.keyDownIsDown = true;
                sendDownKeyDownMessage(client);
            }
            break;

        // case 32: // spacebar
        case 90: // z
            if (!client.keyZIsDown) {
                client.keyZIsDown = true;
                sendSkillOnePressMessage(client);
            }
            break;
        
        case 88: // x
            if (!client.keyXIsDown) {
                client.keyXIsDown = true;
                sendSkillTwoPressMessage(client);
            }
            break;
    }
}

export function handleKeyUpEvent(client: Client, e: KeyboardEvent) {
    switch(e.keyCode) {
        case 37: // left
        case 65: // a
            if (client.keyLeftIsDown) {
                client.keyLeftIsDown = false;
                sendLeftKeyUpMessage(client);
            }

            break;
        case 39: // right
        case 68: // d
            if (client.keyRightIsDown) {
                client.keyRightIsDown = false;
                sendRightKeyUpMessage(client);
            }

            break;
        case 38: // up
        case 87: // w
            if (client.keyUpIsDown) {
                client.keyUpIsDown = false;
                sendUpKeyUpMessage(client);
            }
            break;
        
        case 40: // down
        case 83: // s
            if (client.keyDownIsDown) {
                client.keyDownIsDown = false;
                sendDownKeyUpMessage(client);
            }
            break;

        // case 32: // spacebar
        case 90: // z
            if (client.keyZIsDown) {
                client.keyZIsDown = false;
                sendSkillOneReleaseMessage(client);
            }
            break;
        
        case 88: // x
            if (client.keyXIsDown) {
                client.keyXIsDown = false;
                sendSkillTwoReleaseMessage(client);
            }
            break;
    }
}