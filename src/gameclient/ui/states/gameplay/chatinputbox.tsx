import { globalGameContext, GlobalGameState } from "../../store/context/globalgamecontext";
import { chatInputBoxSlice } from "../../store/features/chatinputboxslice";
import { chatInputBoxAllowedCharactersJoined } from "../utils/chatutils";
import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Text } from "../../basecomponents/text";
import { Component } from "../../core/component";
import { Scene } from "THREE";

interface Props {
    // Component props.
    chatFocused: boolean;
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
    // Context props.
    chatCurrentKeystroke?: string[];
    chatInputBoxContents?: string;
    onChatSubmit?: (contents: string) => void;
}

interface State {
    charactersRemaining: number;
    charactersRemainingFontColor: string;
    charactersRemainingTop: number;
    charactersRemainingLeft: number;
}

export class ChatInputBox extends Component<Props, State> {
    unfocusedFontColor = "#C0C0C0";
    unfocusedContents = "[Enter] to Chat";
    textCursorCharacter = "_";
    textCursorInterval: NodeJS.Timeout = undefined;
    maxCharacters = 50;
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            charactersRemaining: this.maxCharacters,
            charactersRemainingFontColor: "#5A5A5A",
            charactersRemainingTop: 20,
            charactersRemainingLeft: 625,
        }
    }

    mapContextToProps(context: GlobalGameState): Partial<GlobalGameState> {
        return { 
            chatCurrentKeystroke: context.chatCurrentKeystroke,
            chatInputBoxContents: context.chatInputBoxContents,
            onChatSubmit: context.onChatSubmit,
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

        if (prevProps?.chatInputBoxContents?.length !== this.props?.chatInputBoxContents?.length) {
            this.updateCharactersRemainingText()
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
            if (this.lastCharIsTextCursor())
                this.backspaceChatInputBoxContents();

            if (this.props.chatInputBoxContents.length > 1) {
                this.props.onChatSubmit(this.props.chatInputBoxContents)
                chatInputBoxSlice.setContents(" ")
            }
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

    updateCharactersRemainingText = () => {
        if (!this.lastCharIsTextCursor()) {
            const charactersTypedWithoutTextCursor = this.maxCharacters - this.props.chatInputBoxContents.length + 1
            if (this.state.charactersRemaining !== charactersTypedWithoutTextCursor) {
                this.setState({
                    charactersRemaining: charactersTypedWithoutTextCursor
                })

                this.setCharactersRemainingFontColor();
            }
        } else {
            const charactersTypedWithTextCursor = this.maxCharacters - this.props.chatInputBoxContents.length + 2
            if (this.state.charactersRemaining !== charactersTypedWithTextCursor) {
                this.setState({
                    charactersRemaining: charactersTypedWithTextCursor
                })

                this.setCharactersRemainingFontColor();
            }
        }

        // If max char limit reached, backspace next typed char.
        if (this.state.charactersRemaining < 0) {
            this.backspaceChatInputBoxContents()
            this.charactersRemainingShake()
        }
    }

    charactersRemainingShake = () => {
        for (let i = 1; i < 10; i++) {
            let randomTopOffset = Math.floor(Math.random() * 2);
            let randomLeftOffset = Math.floor(Math.random() * 2);
            randomTopOffset *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
            randomLeftOffset *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

            // Set offset.
            this.setState({
                charactersRemainingTop: this.state.charactersRemainingTop += randomTopOffset,
                charactersRemainingLeft: this.state.charactersRemainingLeft += randomLeftOffset,
            })

            // Reset to original position after a delay.
            setTimeout(() => {
                this.setState({
                    charactersRemainingTop: this.state.charactersRemainingTop += randomTopOffset * -1,
                    charactersRemainingLeft: this.state.charactersRemainingLeft += randomLeftOffset * -1,
                })
            }, 25 * i)
        }
    }

    setCharactersRemainingFontColor = () => {
        if (this.state.charactersRemaining >= 20) {
            this.setState({
                charactersRemainingFontColor: "#5A5A5A"
            })
        }
        else if (this.state.charactersRemaining < 20 && this.state.charactersRemaining >= 10) {
            this.setState({
                charactersRemainingFontColor: "#8B8000"
            })
        } else if (this.state.charactersRemaining < 10) {
            this.setState({
                charactersRemainingFontColor: "#811331"
            })
        }
    }

    renderCharactersRemaining = () => {
        if (this.props.chatFocused)
            return (<Text
                fontColor={this.state.charactersRemainingFontColor}
                fontSize="12"
                top={this.state.charactersRemainingTop}
                left={this.state.charactersRemainingLeft}
                contents={this.state.charactersRemaining.toString()}>
            </Text>)
        else
            return (<label></label>)
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
                onBlur={() => chatInputBoxSlice.setFocus(false)}
                onFocus={() => chatInputBoxSlice.setFocus(true)}
            >
                <Text
                    fontColor={this.props.chatFocused ? this.props.fontColor : this.unfocusedFontColor}
                    top={this.props.fontTop}
                    left={this.props.fontLeft}
                    contents={this.props.chatFocused ? this.props.chatInputBoxContents : this.unfocusedContents}
                    font={this.props.font}
                    fontSize={this.props.fontSize}>
                </Text>

                {this.renderCharactersRemaining()}
            </panel>
        )
    }
}
