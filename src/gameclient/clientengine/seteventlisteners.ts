import { scaleToWindow } from "./scaletowindow";
import { Client } from "./client";

export function setEventListeners(canvas: HTMLCanvasElement, client: Client) {
    // call first to scale to current window dimensions
    scaleToWindow(canvas);

    window.addEventListener("resize", function () {
        const scaleValue = scaleToWindow(canvas);
        client.scaleUI(scaleValue)
    });

    window.onkeydown = function(e: KeyboardEvent) {
        client.handleEvent(e);
    }

    window.onkeyup = function(e: KeyboardEvent) {
        client.handleEvent(e);
    }
}