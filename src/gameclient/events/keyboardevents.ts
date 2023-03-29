import { sendDownKeyUpMessage, sendDownKeyDownMessage, sendLeftKeyDownMessage, sendLeftKeyUpMessage, sendRightKeyDownMessage, sendRightKeyUpMessage, sendUpKeyDownMessage, sendUpKeyUpMessage, sendSkillOneReleaseMessage, sendSkillTwoReleaseMessage, sendSkillOnePressMessage, sendSkillTwoPressMessage, sendDodgeKeyPressMessage } from "../messaging/sendclientinputmessages";
import { chatInputBoxSlice } from "../ui/store/features/chatinputboxslice";
import { Client } from "../clientengine/client";

// TODO: Refactor to using e.code over deprecated e.keyCodes

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

        case 67: // c
            if (!client.dodgeKeyPressed) {
                client.dodgeKeyPressed = true;
                sendDodgeKeyPressMessage(client);
            }
            break;
        
        case 73: // i
            if (!client.inventoryKeyPressed) {
                client.inventoryKeyPressed = true;

                if (client.getUIState().inventoryViewToggle)
                    client.rootComponent.setInventoryViewToggle(false)
                else
                    client.rootComponent.setInventoryViewToggle(true)
            }
            break;

        case 13: // enter
            if (!client.chatKeyPressed) {
                client.chatKeyPressed = true;

                if (!client.getUIGameContext().chatFocused)
                    // client.rootComponent.setChatFocus(true)
                    chatInputBoxSlice.setFocus(true)
                else {
                    // client.rootComponent.setChatFocus(false)
                    chatInputBoxSlice.setFocus(false)
                }
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

        case 67: // c
            if (client.dodgeKeyPressed) {
                // No event to send, set boolean to false.
                client.dodgeKeyPressed = false;
            }
            break;

        case 73: // i
            if (client.inventoryKeyPressed) {
                // No event to process, set boolean to false.
                client.inventoryKeyPressed = false;
            }
            break;

        case 13: // enter
            if (client.chatKeyPressed) {
                // No event to process, set boolean to false.
                client.chatKeyPressed = false;
            }
            break;
    }
}