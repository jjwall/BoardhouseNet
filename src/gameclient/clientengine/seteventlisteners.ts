import { scaleToWindow } from "./scaletowindow";
import { Client } from "./client";

export function setEventListeners(canvas: HTMLCanvasElement, client: Client) {
    // call first to scale to current window dimensions
    scaleToWindow(canvas);

    window.addEventListener("resize", function () {
        scaleToWindow(canvas);
    });

    window.onkeydown = function(e: KeyboardEvent) {
        client.handleEvent(e);
    }

    window.onkeyup = function(e: KeyboardEvent) {
        client.handleEvent(e);
    }

    canvas.addEventListener("pointerdown", function (e: PointerEvent) {
        e.preventDefault(); // Prevents MouseEvent from also firing.
        client.handleEvent(e);
    });

    canvas.addEventListener("pointerup", function (e: PointerEvent) {
        e.preventDefault();
        client.handleEvent(e);
    });

    canvas.addEventListener("pointermove", function (e: PointerEvent) {
        e.preventDefault();
        client.handleEvent(e);
    });
}