import { createJSXElement } from "./../createjsxelement";
import { JSXElement } from "./../interfaces";
import { Component } from "./../component";
import { Scene, Vector3 } from "three";

// TODO: Props pass down that handle possible item?
// TODO: Drag = false if no equipment exists?
// TODO: Turn DraggableWidget into EquipmentSlot UI?
interface Props {
    pressedLayout: string;
    unpressedLayout: string;
    width: string | number;
    height: string | number;
    top: string | number;
    left: string | number;
    onDragEnd: (worldPosX: number, worldPosY: number) => void;
    center?: boolean;
    backgroundColor?: string;
}

interface State {
    dragging: boolean;
    pressed: boolean;
    top: string | number
    left: string | number
    initialWorldPositionX: number
    initialWorldPositionY: number
    initialWorldPositionSet: boolean
    z_index: number
}

export class DraggableWidget extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            dragging: false,
            pressed: false,
            top: this.props.top,
            left: this.props.left,
            initialWorldPositionX: 0,
            initialWorldPositionY: 0,
            initialWorldPositionSet: false,
            z_index: 0
        }
    }

    public press = (): void => {
        if (!this.state.initialWorldPositionSet) {
            const position = new Vector3();
            this._internalInstance.widget.getWorldPosition(position);

            // If widget pos isn't offset by parent widget then keep initial world pos x and y at 0.
            if (Number(this.props.top) === -position.y && Number(this.props.left) === position.x) {
                this.setState({
                    initialWorldPositionSet: true
                })
            } else {
                this.setState({
                    initialWorldPositionX: position.x,
                    initialWorldPositionY: position.y,
                    initialWorldPositionSet: true
                })
            }
        }

        this.setState({
            pressed: true
        });
    }

    public drag = (e: PointerEvent): void => {
        let halfHeight = Number(this.props.height)/2
        let halfWidth = Number(this.props.width)/2
        if (this.props.center) {
            halfHeight = 0
            halfWidth = 0
        }
        this.setState({
            top: e.offsetY + this.state.initialWorldPositionY - halfWidth,
            left: e.offsetX - this.state.initialWorldPositionX - halfHeight,
            z_index: 5,
            dragging: true
        })
    }

    public unpress = (): void => {
        this.setState({
            pressed: false,
            z_index: 0
        });

        if (this.state.dragging) {
            const position = new Vector3();
            this._internalInstance.widget.getWorldPosition(position);
            this.props.onDragEnd(position.x, position.y)
            this.setState({
                dragging: false
            });
        }
    }

    render(): JSXElement {
        return (
            <panel
                center={this.props.center ?? false}
                color={this.props.backgroundColor ?? undefined}
                height={this.props.height}
                width={this.props.width}
                left={this.state.left}
                top={this.state.top}
                img={this.state.pressed ? this.props.pressedLayout : this.props.unpressedLayout}
                onPress={() => this.press()}
                onUnpress={() => this.unpress()}
                onDrag={(e: PointerEvent) => this.drag(e)}
                z_index={this.state.z_index}
            >
            </panel>
        )
    }
}
