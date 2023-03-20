import { createJSXElement } from "../core/createjsxelement";
import { JSXElement } from "../core/interfaces";
import { Component } from "../core/component";
import { Scene } from "THREE";

/** Example how you might use this component:
    <InputBox
        boxColor="#C9CFFF"
        borderColor="#000000"
        top="600"
        left="100"
        fontTop="18"
        width={250}
        height={20}
        contents={someDynamicState's contents}
    />
 */

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