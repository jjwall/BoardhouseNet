import { createJSXElement } from "../core/createjsxelement";
import { JSXElement } from "../core/interfaces";
import { Component } from "../core/component";
import { Scene } from "THREE";

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
    // submit: () => void;
    focused: boolean;
    setFocus: (toggle: boolean) => void;
}

export class InputBox extends Component<Props, {}> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    render(): JSXElement {
        return (
            <panel
                height={this.props.height + 2}
                width={this.props.width + 2}
                color={this.props.focused ? this.props.borderColor : this.props.boxColor}
                top={this.props.top}
                left={this.props.left}
            >
                <panel
                    color={this.props.boxColor}
                    height={this.props.height}
                    width={this.props.width}
                    onPress={() => {}}
                    onUnpress={() => {}}
                    onBlur={() => this.props.setFocus(false)}
                    onFocus={() => this.props.setFocus(true)}
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