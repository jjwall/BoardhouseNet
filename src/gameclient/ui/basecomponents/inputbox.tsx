// /** @jsx createJSXElement */
import { createJSXElement } from "../core/createjsxelement";
import { JSXElement } from "../core/interfaces";
import { Scene } from "THREE";
import { Component } from "../core/component";

interface Props {
    boxColor: string,
    borderColor: string,
    width: number,
    height: number,
    top: string | number,
    left: string | number,
    contents?: string,
    fontColor?: string,
    fontSize?: string | number,
    fontTop?: string | number;
    fontLeft?: string | number;
    font?: string;
    submit: () => void,
}

interface State {
    focused: boolean;
}

export class InputBox extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            focused: false,
        }
    }

    public focus = (): void => {
        this.setState({
            focused: true
        });
    }

    public blur = (): void => {
        if (this.state.focused) {
            this.setState({
                focused: false
            });
        }
    }

    render(): JSXElement {
        return (
        // <panel height="35" width="310" color="#FFFFFF" top="400" left="640">
        //     <panel height="25" width="300" color="#000000"></panel>
        // </panel>
            <panel
                height={this.props.height + 2}
                width={this.props.width + 2}
                color={this.state.focused ? this.props.borderColor : this.props.boxColor}
                top={this.props.top}
                left={this.props.left}
            >
                <panel
                    color={this.props.boxColor}
                    height={this.props.height}
                    width={this.props.width}
                    onPress={() => {}}
                    onUnpress={() => {}}
                    onBlur={() => this.blur()}
                    onFocus={() => this.focus()}
                    top={1}
                    left={1}
                >
                    <label
                        // color={this.state.pressed ? this.props.pressedFontColor : this.props.unpressedFontColor}
                        color = {this.props.fontColor}
                        top={this.props.fontTop}
                        left={this.props.fontLeft}
                        contents={this.props.contents}
                        font={this.props.font}
                        font_size={this.props.fontSize}>
                    </label>
                </panel>
            </panel>
        )
    }
}