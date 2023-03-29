import { GlobalGameState } from "../../store/context/globalgamecontext";
import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Text } from "../../basecomponents/text";
import { Component } from "../../core/component";
import { Scene } from "THREE";

interface Props {
    // Component props.
    boxColor: string;
    width: string | number;
    height: string | number;
    top: string | number;
    left: string | number;
    contents: string;
    opacity: string | number;
    fontColor?: string;
    fontSize?: string | number;
    fontTop?: string | number;
    fontLeft?: string | number;
    font?: string;
    // setFocus: (toggle: boolean) => void;
    // Context props.
    chatFocused?: boolean;
    chatCurrentKeystroke?: string[];
}

export class ChatInputBox extends Component<Props, {}> {
    unfocusedFontColor = "#C0C0C0";
    unfocusedContents = "[Enter] to Chat";
    textCursorCharacter = "_";
    textCursorInterval: NodeJS.Timeout = undefined;
    lastCharIsTextCursor = () => true //this.state.chatInputBoxContents.substring(this.state.chatInputBoxContents.length - 1, this.state.chatInputBoxContents.length) === this.textCursorCharacter;
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    mapContextToProps(context: GlobalGameState): Partial<GlobalGameState> {
        return { 
            chatFocused: context.chatFocused,
            chatCurrentKeystroke: context.chatCurrentKeystroke
        }
    }

    componentDidUpdate(prevProps: Props): void {
        if (prevProps?.chatFocused !== this.props?.chatFocused) {
            if (this.props.chatFocused)
                console.log("setInterval")
            else
                console.log("unsetInterval")
        }

        // console.log(this.props?.chatCurrentKeystroke)
        // const prevPropsKeystroke = prevProps?.chatCurrentKeystroke.find(x=>x!==undefined);
        // const propsKeyStroke = this.props?.chatCurrentKeystroke.find(x=>x!==undefined)
        if (prevProps?.chatCurrentKeystroke !== this.props?.chatCurrentKeystroke) {
            console.log(this.props.chatCurrentKeystroke)
        }
    }

    setTextCursor = (toggle: boolean) => {
        if (!toggle) {
            clearInterval(this.textCursorInterval)

            if (this.lastCharIsTextCursor()) {
                // this.backspaceChatInputBoxContents();

            }
        } else {
            this.textCursorInterval = setInterval(() => {
                // if (this.lastCharIsTextCursor()) {
                //     this.backspaceChatInputBoxContents();
                // } else {
                //     this.updateChatInputBoxContents(this.textCursorCharacter);
                // }
            }, 500)
        }
    }

    // updateChatInputBoxContents = (enteredKey: string) => {
    //     const strRegEx = '[^,]*'+enteredKey+'[,$]*';
    //     if (chatInputBoxAllowedCharactersJoined.match(strRegEx)) {
    //         if (this.lastCharIsTextCursor()) {
    //             this.backspaceChatInputBoxContents();
    //         }
    //         this.setState({
    //             chatInputBoxContents: this.state.chatInputBoxContents += enteredKey
    //         })
    //     } else if (enteredKey === 'Backspace') {
    //         this.lastCharIsTextCursor() ? this.backspaceChatInputBoxContents(2) : this.backspaceChatInputBoxContents()
    //     } else if (enteredKey === 'Enter') {
    //         this.setUIEvents([UIEventTypes.SEND_CHAT_MESSAGE])
    //     }
    // }

    // backspaceChatInputBoxContents = (deleteIndex = 1) => {
    //     // Edge case for keeping " " cushion workaround at index = 1 for chat input box.
    //     if (deleteIndex === 2 && this.state.chatInputBoxContents === " " + this.textCursorCharacter)
    //         deleteIndex = 1

    //     if (this.state.chatInputBoxContents.length > 1) {
    //         this.setState({
    //             chatInputBoxContents: this.state.chatInputBoxContents.slice(0, this.state.chatInputBoxContents.length - deleteIndex)
    //         })
    //     } else if (this.state.chatInputBoxContents.length === 1 && this.state.chatInputBoxContents !== " ") {
    //         this.setState({
    //             chatInputBoxContents: " " // Workaround, empty string doesn't play well.
    //         })
    //     }
    // }

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
                    contents={this.props.chatFocused ? this.props.contents : this.unfocusedContents}
                    font={this.props.font}
                    fontSize={this.props.fontSize}>
                </Text>
            </panel>
        )
    }
}