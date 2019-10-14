import { scaleToWindow } from "./scaletowindow";
// import { BaseState } from "../basestate";
// import { Widget } from "../ui/widget";
// import { Entity } from "./entity";
import { last } from "./helpers";
import { IBoardHouseFront } from "./interfaces";
import { BoardhouseMessage } from "../../packets/boardhousemessage";

export function setEventListeners(canvas: HTMLCanvasElement, boardhouseFront: IBoardHouseFront) {
    // call first to scale to current window dimensions
    scaleToWindow(canvas);

    window.addEventListener("resize", function () {
        scaleToWindow(canvas);
    });

    // keyboard controls
    window.onkeydown = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37) {
            const message: BoardhouseMessage = {
                [boardhouseFront.currentLoginUserId]: {
                    left: true,
                }
            }

            boardhouseFront.connection.send(JSON.stringify(message));
        }

        // right
        if (e.keyCode === 39) {
            const message: BoardhouseMessage = {
                [boardhouseFront.currentLoginUserId]: {
                    right: true,
                }
            }
            
            boardhouseFront.connection.send(JSON.stringify(message));
        }
    }

    window.onkeyup = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37) {
            const message: BoardhouseMessage = {
                [boardhouseFront.currentLoginUserId]: {
                    left: false,
                }
            }
            
            boardhouseFront.connection.send(JSON.stringify(message));
        }

        // right
        if (e.keyCode === 39) {
            const message: BoardhouseMessage = {
                [boardhouseFront.currentLoginUserId]: {
                    right: false,
                }
            }
            
            boardhouseFront.connection.send(JSON.stringify(message));
        }
    }
}