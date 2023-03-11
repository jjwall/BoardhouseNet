import { createJSXElement } from "../../core/createjsxelement";
import { InputBox } from "../../basecomponents/inputbox";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Scene } from "THREE";

interface Props {
    top?: string | number;
    left?: string | number;
    color: string
    opacity: string | number
    inputBoxContents: string;
    inputBoxFocused: boolean;
    setInputBoxFocus: (toggle: boolean) => void;
}

export class Chat extends Component<Props, {}> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    render(): JSXElement {
        return (
            <panel top={this.props.top} left={this.props.left} height={237} width={450} color={this.props.color} opacity={this.props.opacity}>
                <InputBox
                    boxColor="#FFFFFF"
                    borderColor="#000000"
                    top="192"
                    left="20"
                    fontTop="18"
                    width="350"
                    height="25"
                    setFocus={this.props.setInputBoxFocus}
                    focused={this.props.inputBoxFocused}
                    contents={this.props.inputBoxContents}
                />
            </panel>
        );
    }
}