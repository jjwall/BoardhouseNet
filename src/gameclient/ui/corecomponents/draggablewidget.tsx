// /** @jsx createJSXElement */
import { createJSXElement } from "./../../ui/createjsxelement";
import { JSXElement } from "./../../ui/interfaces";
import { Scene, Vector3 } from "three";
import { Component } from "./../../ui/component";

interface Props {
    pressedLayout: string;
    unpressedLayout: string;
    width: string | number,
    height: string | number,
    top: string | number,
    left: string | number,
    backgroundColor?: string;
    submit: () => void,
}

interface State {
    pressed: boolean;
    top: string | number
    left: string | number
}

export class DraggableWidget extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            pressed: false,
            top: this.props.top,
            left: this.props.left
        }
    }

    public press = (): void => {
        this.setState({
            pressed: true
        });
    }

    public drag = (e: PointerEvent): void => {
        const position = new Vector3();
        this._internalInstance.widget.getWorldPosition(position);
        // console.log(position.x)
        // console.log(position.y)
        // console.log(e.offsetX)
        // console.log(e.offsetY)

        // This does not account for offset top / left yet.
        this.setState({
            top: e.offsetY,
            left: e.offsetX
        })
    }

    public unpress = (): void => {
        this.setState({
            pressed: false
        });
    }

    render(): JSXElement {
            return (
                <panel
                    color={this.props.backgroundColor ?? undefined}
                    height={this.props.height}
                    width={this.props.width}
                    left={this.state.left}
                    top={this.state.top}
                    img={this.state.pressed ? this.props.pressedLayout : this.props.unpressedLayout}
                    onPress={() => this.press()}
                    onUnpress={() => this.unpress()}
                    onSubmit={() => this.props.submit()}
                    onDrag={(e: PointerEvent) => this.drag(e)}
                >
                </panel>
            )
    }
}
