import { Instance, JSXElement, WidgetInstance, ComponentInstance } from "./interfaces";
import { globalGameContext } from "../store/context/globalgamecontext";
import { updateWidgetProperties } from "./updatewidgetproperties";
import { instantiate } from "./instantiate";
import { Widget } from "./widget";
import { Scene } from "three";

export function reconcile(parentWidget: Widget, instance: Instance, element: JSXElement, scene: Scene): Instance {
    if (instance == null) {
        // Create instance.
        const newInstance = instantiate(element, scene);
        parentWidget.appendChild(newInstance.widget);

        return newInstance;
    }
    else if (element == null) {
        // Remove instance.
        parentWidget.removeChild(instance.widget);

        return null;
    }
    else if (instance.element.type !== element.type) {
        // Replace instance.
        const newInstance = instantiate(element, scene);
        parentWidget.replaceChild(newInstance.widget, instance.widget);

        return newInstance;
    }
    else if (typeof element.type === "string") {
        // Update widget instance.
        let widgetInstance = instance as WidgetInstance;
        updateWidgetProperties(widgetInstance.widget, widgetInstance.element.props, element.props);
        widgetInstance.children = reconcileChildren(widgetInstance, element, scene);
        widgetInstance.element = element;
        return widgetInstance;
    }
    else {
        // Update component instance.
        let componentInstance = instance as ComponentInstance;
        // Set previous props and previous state.
        componentInstance.component.prevProps = { ...componentInstance.component.props }
        componentInstance.component.prevState = { ...componentInstance.component.state }
        
        componentInstance.component.props = { ...element.props };

        if (componentInstance.component.mapContextToProps)
            Object.assign(componentInstance.component.props, componentInstance.component.mapContextToProps(globalGameContext))

        const childElement = componentInstance.component.render();
        const oldChildInstance = componentInstance.child;
        const childInstance = reconcile(parentWidget, oldChildInstance, childElement, scene);
        componentInstance.widget = childInstance.widget;
        componentInstance.child = childInstance;
        componentInstance.element = element;

        // Call componentDidUpdate if defined on component.
        if (componentInstance.component.componentDidUpdate)
            componentInstance.component.componentDidUpdate(componentInstance.component.prevProps, componentInstance.component.prevState);

        return componentInstance;
    }
}

function reconcileChildren(instance: WidgetInstance, element: JSXElement, scene: Scene): WidgetInstance[] | Instance[] {
    const widget = instance.widget;
    const childInstances = instance.children;
    const nextChildElements = element.children || [];
    const newChildInstances: Instance[] = [];
    const count = Math.max(childInstances.length, nextChildElements.length);

    for (let i = 0; i < count; i++) {
        const childInstance = childInstances[i];
        const childElement = nextChildElements[i];
        const newChildInstance = reconcile(widget, childInstance, childElement, scene);
        newChildInstances.push(newChildInstance);
    }

    return newChildInstances.filter(instance => instance != null);
}
