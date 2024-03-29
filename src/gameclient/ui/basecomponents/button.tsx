import { createJSXElement } from "../core/createjsxelement";
import { JSXElement } from "../core/interfaces";
import { Component } from "../core/component";
import { Scene } from "three";
import { Text } from "./text";

interface Props {
    /** Color or img url */
    pressedLayout: string;
    /** Color or img url */
    unpressedLayout: string;
    width: string | number,
    height: string | number,
    top: string | number,
    left: string | number,
    opacity?: string | number
    contents?: string,
    fontSize?: string | number,
    pressedFontColor?: string;
    unpressedFontColor?: string;
    fontTop?: string | number;
    fontLeft?: string | number;
    font?: string;
    backgroundColor?: string;
    imgPixelRatio?: number
    submit: () => void,
}

interface State {
    pressed: boolean;
}

export class Button extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            pressed: false,
        }
    }

    public press = (): void => {
        this.setState({
            pressed: true
        });
    }

    public unpress = (): void => {
        this.setState({
            pressed: false
        });
    }

    render(): JSXElement {
        // case: colored button (placeholder)
        if (this.props.pressedLayout.substring(0, 1) === "#") {
            return (
                <panel
                    color={this.state.pressed ? this.props.pressedLayout : this.props.unpressedLayout}
                    width={this.props.width}
                    height={this.props.height}
                    top={this.props.top}
                    left={this.props.left}
                    onPress={() => this.press()}
                    onUnpress={() => this.unpress()}
                    onSubmit={() => this.props.submit()}
                    opacity={this.props.opacity}
                >
                    <Text
                        fontColor={this.state.pressed ? this.props.pressedFontColor : this.props.unpressedFontColor}
                        top={this.props.fontTop}
                        left={this.props.fontLeft}
                        contents={this.props.contents}
                        font={this.props.font}
                        fontSize={this.props.fontSize}>
                    </Text>
                </panel>
            )
        }
        else { // case: img button
            return (
                <panel
                    color={this.props.backgroundColor ?? undefined}
                    height={this.props.height}
                    width={this.props.width}
                    left={this.props.left}
                    top={this.props.top}
                    img={this.state.pressed ? this.props.pressedLayout : this.props.unpressedLayout}
                    onPress={() => this.press()}
                    onUnpress={() => this.unpress()}
                    onSubmit={() => this.props.submit()}
                    pixel-ratio={this.props.imgPixelRatio ?? 4}
                >
                </panel>
            )
        }
    }
}
