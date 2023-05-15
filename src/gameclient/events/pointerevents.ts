import { Widget } from "../ui/core/widget";
import { Vector3 } from "three";

let pressedWidgets: Widget[] = [];
let focusedWidget: Widget;

export function handlePointerDownEvent(widget: Widget, e: PointerEvent) {
    if ((widget.event("press") || widget.event("unpress") || widget.event("submit") || widget.event("blur") || widget.event("focus")) && widget.attr("height") && widget.attr("width")) {
        let halfWidth = Number(widget.attr("width"))/2;
        let halfHeight = Number(widget.attr("height"))/2;
        const widgetIndex: number = pressedWidgets.indexOf(widget);
        const position = new Vector3();
        widget.getWorldPosition(position);
        let notCenteredOffsetX = 0
        let notCenteredOffsetY = 0

        if(!widget.attr('center')) {
            notCenteredOffsetX = halfWidth * 2
            notCenteredOffsetY = halfHeight * 2
            halfWidth *= 2
            halfHeight *= 2
        }

        // TODO: use sweep & prune alg instead of AABB
        if (e.offsetY - notCenteredOffsetY > -position.y - halfHeight
            && e.offsetY - halfHeight < -position.y
            && e.offsetX - notCenteredOffsetX > position.x - halfWidth
            && e.offsetX - halfWidth < position.x)
        {
            // WidgetIndex necessary?
            if (widgetIndex === -1) {
                pressedWidgets.push(widget);
                widget.trigger("press", e);

                if (widget.event("focus") && widget.event("blur")) {
                    widget.trigger("focus");
                    focusedWidget = widget;
                }
            }
        }
    }

    if (focusedWidget) {
        let halfWidth = Number(focusedWidget.attr("width"))/2;
        let halfHeight = Number(focusedWidget.attr("height"))/2;
        const position = new Vector3();
        focusedWidget.getWorldPosition(position);
        let notCenteredOffsetX = 0
        let notCenteredOffsetY = 0

        if(!widget.attr('center')) {
            notCenteredOffsetX = halfWidth * 2
            notCenteredOffsetY = halfHeight * 2
            halfWidth *= 2
            halfHeight *= 2
        }

        // TODO: use sweep & prune alg instead of AABB
        if (e.offsetY - notCenteredOffsetY > -position.y - halfHeight
            && e.offsetY - halfHeight < -position.y
            && e.offsetX - notCenteredOffsetX > position.x - halfWidth
            && e.offsetX - halfWidth < position.x)
        {}
        else {
            focusedWidget.trigger("blur", e);
            focusedWidget = undefined;
        }
    }

    widget.childNodes.forEach(child => {
        handlePointerDownEvent(child, e);
    });
}

// For making controls like KartRider work.. a little more effore will need to be put into this.
// Currently can really only handle pressing one button at a time. Unpress will be triggered on all buttons
export function handlePointerUpEvent(e: PointerEvent) {
    for (let i = 0; i < pressedWidgets.length; i++) {
        let halfWidth = Number(pressedWidgets[0].attr("width"))/2;
        let halfHeight = Number(pressedWidgets[0].attr("height"))/2;
        const position = new Vector3();
        let notCenteredOffsetX = 0
        let notCenteredOffsetY = 0
        pressedWidgets[0].getWorldPosition(position);

        if(!pressedWidgets[i].attr('center')) {
            notCenteredOffsetX = halfWidth * 2
            notCenteredOffsetY = halfHeight * 2
            halfWidth *= 2
            halfHeight *= 2
        }

        // TODO: use sweep & prune alg instead of AABB
        if (e.offsetY - notCenteredOffsetY > -position.y - halfHeight
            && e.offsetY - halfHeight < -position.y
            && e.offsetX - notCenteredOffsetX > position.x - halfWidth
            && e.offsetX - halfWidth < position.x)
        {
            // TODO: Make sure only top most widget's submit event is triggered.
            // Right now it's triggering all widgets' submit events if they are stacked.

            // Trigger events.
            pressedWidgets[i].trigger("submit", e);
            pressedWidgets[i].trigger("unpress", e);
        }
        else {
            // Cursor release when off of button so don't trigger click.
            pressedWidgets[i].trigger("unpress", e);
        }
    }

    // Clear pressedWidgets.
    pressedWidgets = [];
}

export function handlePointerMoveEvent(e: PointerEvent) {
    for (let i = 0; i < pressedWidgets.length; i++) {
        if (pressedWidgets[i].event("drag")) {
            pressedWidgets[i].trigger("drag", e)
        }
    }
}