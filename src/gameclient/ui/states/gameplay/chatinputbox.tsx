import { globalGameContext, GlobalGameState } from "../../store/context/globalgamecontext";
import { chatInputBoxSlice } from "../../store/features/chatinputboxslice";
import { chatInputBoxAllowedCharactersJoined } from "../utils/chatutils";
import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Text } from "../../basecomponents/text";
import { Component } from "../../core/component";
import { Scene } from "THREE";

// TODO: Fix sending messages
// TODO: Move over chat stuff here.

interface Props {
    // Component props.
    boxColor: string;
    width: string | number;
    height: string | number;
    top: string | number;
    left: string | number;
    opacity: string | number;
    fontColor?: string;
    fontSize?: string | number;
    fontTop?: string | number;
    fontLeft?: string | number;
    font?: string;
    // setUIEvents
    // Context props.
    chatFocused?: boolean;
    chatCurrentKeystroke?: string[];
    chatInputBoxContents?: string;
}

export class ChatInputBox extends Component<Props, {}> {
    unfocusedFontColor = "#C0C0C0";
    unfocusedContents = "[Enter] to Chat";
    textCursorCharacter = "_";
    textCursorInterval: NodeJS.Timeout = undefined;
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    mapContextToProps(context: GlobalGameState): Partial<GlobalGameState> {
        return { 
            chatFocused: context.chatFocused,
            chatCurrentKeystroke: context.chatCurrentKeystroke,
            chatInputBoxContents: context.chatInputBoxContents,
        }
    }

    componentDidUpdate(prevProps: Props): void {
        if (prevProps?.chatFocused !== this.props?.chatFocused) {
            this.setTextCursor(this.props.chatFocused)
        }

        if (prevProps?.chatCurrentKeystroke !== this.props?.chatCurrentKeystroke) {
            if (this.props.chatCurrentKeystroke.length > 0)
                this.updateChatInputBoxContents(this.props.chatCurrentKeystroke[0])
        }
    }

    lastCharIsTextCursor = () => this.props.chatInputBoxContents.substring(this.props.chatInputBoxContents.length - 1, this.props.chatInputBoxContents.length) === this.textCursorCharacter;

    setTextCursor = (toggle: boolean) => {
        if (!toggle) {
            clearInterval(this.textCursorInterval)

            if (this.lastCharIsTextCursor()) {
                this.backspaceChatInputBoxContents();
            }
        } else {
            this.textCursorInterval = setInterval(() => {
                if (this.lastCharIsTextCursor()) {
                    this.backspaceChatInputBoxContents();
                } else {
                    this.updateChatInputBoxContents(this.textCursorCharacter);
                }
            }, 500)
        }
    }

    updateChatInputBoxContents = (enteredKey: string) => {
        const strRegEx = '[^,]*'+enteredKey+'[,$]*';
        if (chatInputBoxAllowedCharactersJoined.match(strRegEx)) {
            if (this.lastCharIsTextCursor()) {
                this.backspaceChatInputBoxContents();
            }
            chatInputBoxSlice.setContents(this.props.chatInputBoxContents + enteredKey)
        } else if (enteredKey === 'Backspace') {
            this.lastCharIsTextCursor() ? this.backspaceChatInputBoxContents(2) : this.backspaceChatInputBoxContents()
        } else if (enteredKey === 'Enter') {
            // send message
            // this.props.setUIEvents([UIEventTypes.SEND_CHAT_MESSAGE])
        }
    }

    backspaceChatInputBoxContents = (deleteIndex = 1) => {
        // Edge case for keeping " " cushion workaround at index = 1 for chat input box.
        if (deleteIndex === 2 && globalGameContext.chatInputBoxContents === " " + this.textCursorCharacter)
            deleteIndex = 1
        if (globalGameContext.chatInputBoxContents.length > 1) {
            const newContents =  this.props.chatInputBoxContents
            chatInputBoxSlice.setContents(newContents.slice(0, newContents.length - deleteIndex))
        } else if (this.props.chatInputBoxContents.length === 1 && this.props.chatInputBoxContents !== " ") {
            chatInputBoxSlice.setContents(" ") // Workaround, empty string doesn't play well.
        }
    }

    render(): JSXElement {
        return (
            <panel
                color={this.props.boxColor}
                opacity={this.props.chatFocused ? this.props.opacity : 0.001 }
                height={this.props.height}
                width={this.props.width}
                top={this.props.top}
                left={this.props.left}
                // onBlur={() => this.props.setFocus(false)}
                // onFocus={() => this.props.setFocus(true)}
            >
                <Text
                    fontColor={this.props.chatFocused ? this.props.fontColor : this.unfocusedFontColor}
                    top={this.props.fontTop}
                    left={this.props.fontLeft}
                    contents={this.props.chatFocused ? this.props.chatInputBoxContents : this.unfocusedContents}
                    font={this.props.font}
                    fontSize={this.props.fontSize}>
                </Text>
            </panel>
        )
    }
}