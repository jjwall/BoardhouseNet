import { createJSXElement } from "../../core/createjsxelement";
import { InputBox } from "../../basecomponents/inputbox";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Scene } from "THREE";

// TODO: (Done) Display Usernames
// TODO: Maintain client cached chat histories, i.e. chat history state
// TODO: (Done) Fix | bug for sent messages.
// TODO: (Done) Test to make sure clients within the same world recieve chat messages.
// TODO: Input box text overflow... how?? z indexes? transparent layer?? Would be good knoweldge for scrollbar stuff too
// TODO: Bug -> " " before chat messages b/c of workaround
// Note: Input box " " space workaround means we can backspace right off the bat. Kinda annoying but ignoring for now.
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