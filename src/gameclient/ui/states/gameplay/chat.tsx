import { UIEventTypes } from "../../../../packets/enums/uieventtypes";
import { createJSXElement } from "../../core/createjsxelement";
import { Button } from "../../basecomponents/button";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Text } from "../../basecomponents/text";
import { ChatHistory, UIEvents } from "./rootui";
import { ChatInputBox } from "./chatinputbox";
import { Scene } from "THREE";

// TODO: (Done) Display Usernames
// TODO: (Done) Maintain client cached chat histories, i.e. chat history state
// TODO: (Done) Fix | bug for sent messages.
// TODO: (Done) Test to make sure clients within the same world recieve chat messages.
// TODO: Input box text overflow... how?? z indexes? transparent layer?? Would be good knoweldge for scrollbar stuff too
// TODO: (Done) Bug -> " " before chat messages b/c of workaround -> Shouldn't be able to backspace.
// TODO: Bug -> Button -> think on release is misaligned
// Note: (Done - Edge case resolved) Input box " " space workaround means we can backspace right off the bat. Kinda annoying but ignoring for now.
// TODO: Add timestamps at beg of messages.
// TODO: Use chat for world notifications too like "inventory full" and "You can't equip that item"
// -> Could use same ChatMessageData interface to this and just append to client's chatHistory
// -> Make more sense if we call it messageHistory?
// TODO: Add color field to chatMessageData interface. Player chats - white, notifications - red, server notifications - yellow, etc.
// TODO: Character limit.
// TODO: Time limit on not focused chat bar.
interface Props {
    top?: string | number;
    left?: string | number;
    chatHistory: ChatHistory;
    color: string
    opacity: string | number
    inputBoxContents: string;
    inputBoxFocused: boolean;
    setUIEvents: (newUIEvents: UIEvents) => void;
}

interface State {
    updateChatHistory: boolean;
}

export class Chat extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            updateChatHistory: false,
        }
    }

    // public componentDidUpdate = (prevProps: Props) => {
    //     if (prevProps.chatHistory.length !== this.props.chatHistory.length) {
    //         console.log("do something")
    //         this.setState({
    //             updateChatHistory: true,
    //         })
    //     }
    // }

    renderChatHistory = () => {
        const currentTopOffset = 185
        const messageSpacing = 25
        const newChatHistory = [...this.props.chatHistory]
        
        return newChatHistory.reverse().map((chatMsgData, index) => {
            if (index < 7) {
                return (<Text
                    top={currentTopOffset - (index*messageSpacing)} 
                    left={5} 
                    contents={`[${chatMsgData.clientUsername}]: ${chatMsgData.chatMessage}`}>
                </Text>)
            } else
                return (<label></label>)
        })
    }

    submit = () => {
        this.props.setUIEvents([UIEventTypes.SEND_CHAT_MESSAGE])
    }

    render(): JSXElement {
        return (
            <panel top={this.props.top} left={this.props.left}>
                <panel
                    height={190}
                    width={450}
                    color={this.props.color}
                    opacity={this.props.inputBoxFocused ? this.props.opacity : 0.001 }>
                </panel>

                <ChatInputBox
                    boxColor={this.props.color}
                    opacity={0.75}
                    top="220"
                    left="0"
                    fontTop="23"
                    width="325"
                    height="30"
                    focused={this.props.inputBoxFocused}
                    contents={this.props.inputBoxContents}
                />

                {/* <Button
                    top="200"
                    left="400"
                    pressedLayout="#FFFFFF"
                    unpressedLayout="#000000"
                    height="50"
                    width="50"
                    opacity="1"
                    submit={() => this.submit()}
                /> */}

                {/* This needs to happen after all main chat UI has rendered, less we trigger unwanted re-renders. */}
                {this.renderChatHistory()}
            </panel>
        );
    }
}