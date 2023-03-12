import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Text } from "../../basecomponents/text";
import { Component } from "../../core/component";
import { Scene } from "THREE";

interface Props {
    boxColor: string,
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

export class ChatInputBox extends Component<Props, {}> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    render(): JSXElement {
        return (
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
            </panel>
        )
    }
}