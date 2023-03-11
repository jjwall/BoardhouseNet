import { createJSXElement } from "../../core/createjsxelement";
import { InputBox } from "../../basecomponents/inputbox";
import { Button } from "../../basecomponents/button";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { ChatHistory } from "./rootui";
import { Scene } from "THREE";

// TODO: (Done) Display Usernames
// TODO: Maintain client cached chat histories, i.e. chat history state
// TODO: (Done) Fix | bug for sent messages.
// TODO: (Done) Test to make sure clients within the same world recieve chat messages.
// TODO: Input box text overflow... how?? z indexes? transparent layer?? Would be good knoweldge for scrollbar stuff too
// TODO: Bug -> " " before chat messages b/c of workaround -> Shouldn't be able to backspace.
// TODO: Bug -> Button -> think on release is misaligned
// Note: (Done - Edge case resolved) Input box " " space workaround means we can backspace right off the bat. Kinda annoying but ignoring for now.
interface Props {
    top?: string | number;
    left?: string | number;
    chatHistory: ChatHistory;
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

    public componentDidUpdate = (prevProps: Props) => {
        if (prevProps.chatHistory.length !== this.props.chatHistory.length) {
            console.log("do something")
        }
    }

    renderChatHistory = () => {
        const testChatHistory = ["test1", "test2", "test3"];
        let currentTopOffset = 150
        return testChatHistory.map((chatMsg, index) =>
            (<label top={currentTopOffset - (index*20)} left={5} contents={chatMsg}></label>)
        )
    }

    render(): JSXElement {
        return (
            <panel top={this.props.top} left={this.props.left} height={237} width={450} color={this.props.color} opacity={this.props.opacity}>
                <panel top="5" left="5" height="152" width="410" color="#FFFFFF" opacity={this.props.opacity}>
                    {this.renderChatHistory()}
                </panel>
                <InputBox
                    boxColor="#FFFFFF"
                    borderColor="#000000"
                    top="182"
                    left="5"
                    fontTop="18"
                    width="325"
                    height="25"
                    setFocus={this.props.setInputBoxFocus}
                    focused={this.props.inputBoxFocused}
                    contents={this.props.inputBoxContents}
                />
                <Button
                    top="200"
                    left="400"
                    pressedLayout="#FFFFFF"
                    unpressedLayout="#000000"
                    height="50"
                    width="50"
                    opacity="1"
                    submit={() => console.log("submitted")}
                />
            </panel>
        );
    }
}