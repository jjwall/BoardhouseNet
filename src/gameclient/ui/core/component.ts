import { ComponentInstance, JSXElement } from "./interfaces";
import { reconcile } from "./reconcile";
import { Scene } from "three";

export abstract class Component<Props = {}, State = {}> {
    public state: State;
    public props: Readonly<Props>;
    public prevState: Readonly<State> = null;
    public prevProps: Readonly<Props> = null;
    private scene: Scene;
    public _internalInstance: ComponentInstance;
    public constructor(props: Props, scene: Scene){
        this.props = props;
        this.state = this.state || {} as State;
        this.scene = scene;
    };
    public setState(partialState: Partial<State>) {
        this.state = Object.assign({}, this.state, partialState);
        updateInstance(this._internalInstance, this.scene);
    }

    public componentDidUpdate?(prevProps: Props, prevState: State): void

    public mapContextToProps?(context: any): any

    abstract render(): JSXElement;
}

function updateInstance(internalInstance: ComponentInstance, scene: Scene): void {
    const parentWidget = internalInstance.widget.getParent();
    const element = internalInstance.element;
    reconcile(parentWidget, internalInstance, element, scene);
}

export function createComponent(element: JSXElement, internalInstance: ComponentInstance, scene: Scene): Component<{}, any> {
    const { type, props } = element;
    const componentConstructor = type as { new(props: {}, scene: Scene): Component<{}, any> }
    var component = new componentConstructor(props, scene);
    component._internalInstance = internalInstance;

    return component;
}