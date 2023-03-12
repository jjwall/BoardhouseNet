import { createJSXElement } from "../core/createjsxelement";
import { JSXElement } from "../core/interfaces";
import { Component } from "../core/component";
import { Scene } from "THREE";
import { Text } from "./text";

interface Props {
    boxColor: string,
    // borderColor: string,
    width: string | number,
    height: string | number,
    top: string | number,
    left: string | number,
    contents: string,
    opacity: string | number,
    fontColor?: string,
    fontSize?: string | number,
    fontTop?: string | number;
    fontLeft?: string | number;
    font?: string;
    focused: boolean;
    setFocus: (toggle: boolean) => void;
}

export class InputBox extends Component<Props, {}> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    render(): JSXElement {
        return (
            // <panel
            //     height={Number(this.props.height) + 2}
            //     width={Number(this.props.width) + 2}
            //     color={this.props.focused ? this.props.borderColor : this.props.boxColor}
            //     top={this.props.top}
            //     left={this.props.left}
            // >
            <panel
                color={this.props.boxColor}
                opacity={this.props.focused ? this.props.opacity : 0.001 }
                height={this.props.height}
                width={this.props.width}
                onPress={() => {}}
                onUnpress={() => {}}
                onBlur={() => this.props.setFocus(false)}
                onFocus={() => this.props.setFocus(true)}
                top={this.props.top}
                left={this.props.left}
            >
                <Text
                    fontColor={this.props.focused ? this.props.fontColor : "#C0C0C0"}
                    top={this.props.fontTop}
                    left={this.props.fontLeft}
                    contents={this.props.focused ? this.props.contents : "[Enter] to Chat"}
                    font={this.props.font}
                    fontSize={this.props.fontSize}>
                </Text>
                {/* <label
                    color = {this.props.fontColor}
                    top={this.props.fontTop}
                    left={this.props.fontLeft}
                    contents={this.props.contents}
                    font={this.props.font}
                    font_size={this.props.fontSize}>
                </label> */}
            </panel>
        )
    }
}