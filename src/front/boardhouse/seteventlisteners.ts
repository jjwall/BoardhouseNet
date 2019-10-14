import { scaleToWindow } from "./scaletowindow";
// import { BaseState } from "../basestate";
// import { Widget } from "../ui/widget";
// import { Entity } from "./entity";
import { last } from "./helpers";

export function setEventListeners(canvas: HTMLCanvasElement) {
    // let hoveredWidgets: Widget[] = [];
    // call first to scale to current window dimensions
    scaleToWindow(canvas);

    window.addEventListener("resize", function () {
        scaleToWindow(canvas);
    });

    // keyboard controls
    window.onkeydown = function(e: KeyboardEvent) {
        // left
        if (e.keyCode === 37) {
            // last(stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
            //     if (ent.control) {
            //         ent.control.left = true;
            //     }
            // });
        }

        // right
        if (e.keyCode === 39) {
            // last(stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
            //     if (ent.control) {
            //         ent.control.right = true;
            //     }
            // });
        }
    }
}