import { scaleToWindow } from "./scaletowindow";
// import { BaseState } from "../basestate";
// import { Widget } from "../ui/widget";
// import { Entity } from "./entity";
import { last } from "./helpers";
import { IBoardHouseFront } from "./interfaces";
import { PlayerMessage } from "../../packets/playermessage";
import { PlayerEventTypes } from "../../packets/playereventtypes";

export function setEventListeners(canvas: HTMLCanvasElement, boardhouseFront: IBoardHouseFront) {
    // call first to scale to current window dimensions
    scaleToWindow(canvas);

    window.addEventListener("resize", function () {
        scaleToWindow(canvas);
    });

    // keyboard controls
    window.onkeydown = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37 && !boardhouseFront.keyLeftIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.LEFT_KEY_DOWN,
                playerId: boardhouseFront.currentLoginUserId
            }

            boardhouseFront.keyLeftIsDown = true;
            boardhouseFront.connection.send(JSON.stringify(message));
        }


        // right
        if (e.keyCode === 39 && !boardhouseFront.keyRightIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.RIGHT_KEY_DOWN,
                playerId: boardhouseFront.currentLoginUserId
            }
            
            boardhouseFront.keyRightIsDown = true;
            boardhouseFront.connection.send(JSON.stringify(message));
        }
    }

    window.onkeyup = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37 && boardhouseFront.keyLeftIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.LEFT_KEY_UP,
                playerId: boardhouseFront.currentLoginUserId
            }
            
            boardhouseFront.keyLeftIsDown = false;
            boardhouseFront.connection.send(JSON.stringify(message));
        }

        // right
        if (e.keyCode === 39 && boardhouseFront.keyRightIsDown) {
            const message: PlayerMessage = {
                eventType: PlayerEventTypes.RIGHT_KEY_UP,
                playerId: boardhouseFront.currentLoginUserId
            }
            
            boardhouseFront.keyRightIsDown = false;
            boardhouseFront.connection.send(JSON.stringify(message));
        }
    }
}