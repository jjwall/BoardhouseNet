import { scaleToWindow } from "./scaletowindow";
// import { BaseState } from "../basestate";
// import { Widget } from "../ui/widget";
// import { Entity } from "./entity";
import { PlayerMessage } from "../../packets/playermessage";
import { PlayerEventTypes } from "../../packets/playereventtypes";
import { ClientStateMachine } from "./clientstatemachine";

export function setEventListeners(canvas: HTMLCanvasElement, stateMachine: ClientStateMachine) {
    // call first to scale to current window dimensions
    scaleToWindow(canvas);

    window.addEventListener("resize", function () {
        scaleToWindow(canvas);
    });

    // keyboard controls
    window.onkeydown = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37 && !stateMachine.keyLeftIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.LEFT_KEY_DOWN,
                playerId: stateMachine.currentPlayerId
            }

            stateMachine.keyLeftIsDown = true;
            stateMachine.connection.send(JSON.stringify(message));
        }


        // right
        if (e.keyCode === 39 && !stateMachine.keyRightIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.RIGHT_KEY_DOWN,
                playerId: stateMachine.currentPlayerId
            }
            
            stateMachine.keyRightIsDown = true;
            stateMachine.connection.send(JSON.stringify(message));
        }
    }

    window.onkeyup = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37 && stateMachine.keyLeftIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.LEFT_KEY_UP,
                playerId: stateMachine.currentPlayerId
            }
            
            stateMachine.keyLeftIsDown = false;
            stateMachine.connection.send(JSON.stringify(message));
        }

        // right
        if (e.keyCode === 39 && stateMachine.keyRightIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.RIGHT_KEY_UP,
                playerId: stateMachine.currentPlayerId
            }
            
            stateMachine.keyRightIsDown = false;
            stateMachine.connection.send(JSON.stringify(message));
        }
    }
}