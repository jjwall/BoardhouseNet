// /** @jsx createJSXElement */
import { createJSXElement } from "./../../createjsxelement";
import { JSXElement } from "./../../interfaces";
import { Scene, Vector3 } from "three";
import { Component } from "./../../component";
import { DraggableWidget } from "../../corecomponents/draggablewidget";

interface Props {
    top: string | number
    left: string | number
}

/**
 * Todo: Test Inventory coming on / off screen.
 */
interface State {
    // top: number
    // left: number
}

export class Inventory extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
        }
    }

    render(): JSXElement {
        return (
            <panel left={this.props.left} top={this.props.top} height="143" width="281" color="#282828">
                <panel left="5" top ="5" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="74" top ="5" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="143" top ="5" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="212" top ="5" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="5" top ="74" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="74" top ="74" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="143" top ="74" height="64" width="64" color="#A9A9A9">
                    {/* <DraggableWidget
                        pressedLayout="./data/textures/icons/d17.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    /> */}
                </panel>
                <panel left="212" top ="74" height="64" width="64" color="#A9A9A9">
                    {/* <DraggableWidget
                        pressedLayout="./data/textures/icons/d17.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    /> */}
                </panel>
            </panel>
        )
    }
}
