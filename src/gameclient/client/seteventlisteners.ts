import { scaleToWindow } from "./scaletowindow";
// import { BaseState } from "../basestate";
// import { Widget } from "../ui/widget";
// import { Entity } from "./entity";
import { PlayerMessage } from "../../packets/playermessage";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { Client } from "./clientstatemachine";

export function setEventListeners(canvas: HTMLCanvasElement, client: Client) {
    // call first to scale to current window dimensions
    scaleToWindow(canvas);

    window.addEventListener("resize", function () {
        scaleToWindow(canvas);
    });

    // keyboard controls
    window.onkeydown = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37 && !client.keyLeftIsDown) {
            const message: PlayerMessage = {
                eventType: ClientEventTypes.LEFT_KEY_DOWN,
                playerId: client.currentPlayerId
            }

            client.keyLeftIsDown = true;
            client.connection.send(JSON.stringify(message));
        }


        // right
        if (e.keyCode === 39 && !client.keyRightIsDown) {
            const message: PlayerMessage = {
                eventType: ClientEventTypes.RIGHT_KEY_DOWN,
                playerId: client.currentPlayerId
            }
            
            client.keyRightIsDown = true;
            client.connection.send(JSON.stringify(message));
        }
    }

    window.onkeyup = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37 && client.keyLeftIsDown) {
            const message: PlayerMessage = {
                eventType: ClientEventTypes.LEFT_KEY_UP,
                playerId: client.currentPlayerId
            }
            
            client.keyLeftIsDown = false;
            client.connection.send(JSON.stringify(message));
        }

        // right
        if (e.keyCode === 39 && client.keyRightIsDown) {
            const message: PlayerMessage = {
                eventType: ClientEventTypes.RIGHT_KEY_UP,
                playerId: client.currentPlayerId
            }
            
            client.keyRightIsDown = false;
            client.connection.send(JSON.stringify(message));
        }
    }
}