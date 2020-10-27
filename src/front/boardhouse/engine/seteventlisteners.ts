import { scaleToWindow } from "./scaletowindow";
// import { BaseState } from "../basestate";
// import { Widget } from "../ui/widget";
// import { Entity } from "./entity";
import { last } from "./helpers";
import { PlayerMessage } from "../../../packets/playermessage";
import { PlayerEventTypes } from "../../../packets/playereventtypes";
import { FrontEngine } from "./frontengine";

export function setEventListeners(canvas: HTMLCanvasElement, engine: FrontEngine) {
    // call first to scale to current window dimensions
    scaleToWindow(canvas);

    window.addEventListener("resize", function () {
        scaleToWindow(canvas);
    });

    // keyboard controls
    window.onkeydown = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37 && !engine.keyLeftIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.LEFT_KEY_DOWN,
                playerId: engine.currentPlayerId
            }

            engine.keyLeftIsDown = true;
            engine.connection.send(JSON.stringify(message));
        }


        // right
        if (e.keyCode === 39 && !engine.keyRightIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.RIGHT_KEY_DOWN,
                playerId: engine.currentPlayerId
            }
            
            engine.keyRightIsDown = true;
            engine.connection.send(JSON.stringify(message));
        }
    }

    window.onkeyup = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37 && engine.keyLeftIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.LEFT_KEY_UP,
                playerId: engine.currentPlayerId
            }
            
            engine.keyLeftIsDown = false;
            engine.connection.send(JSON.stringify(message));
        }

        // right
        if (e.keyCode === 39 && engine.keyRightIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.RIGHT_KEY_UP,
                playerId: engine.currentPlayerId
            }
            
            engine.keyRightIsDown = false;
            engine.connection.send(JSON.stringify(message));
        }
    }
}