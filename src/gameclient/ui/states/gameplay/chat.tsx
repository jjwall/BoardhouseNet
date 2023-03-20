import { ChatMessageData } from "../../../../packets/data/chatmessagedata";
import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Text } from "../../basecomponents/text";
import { ChatInputBox } from "./chatinputbox";
import { ChatHistory } from "./rootui";
import { Scene } from "THREE";

// To-done's.
// TODO: (Done) Display Usernames
// TODO: (Done) Maintain client cached chat histories, i.e. chat history state
// TODO: (Done) Fix | bug for sent messages.
// TODO: (Done) Test to make sure clients within the same world recieve chat messages.
// TODO: (Done) Bug -> " " before chat messages b/c of workaround -> Shouldn't be able to backspace.
// Note: (Done - Edge case resolved) Input box " " space workaround means we can backspace right off the bat. Kinda annoying but ignoring for now.
// TODO: (Done) Prohibit typing more characters if max char limit reached.
// TODO: (Done) Character limit render.
// TODO: (Done) Time limit on not focused chat bar.

// Feature / branch complete list:
// TODO: (Done) Use chat for world notifications too like "inventory full" and "You can't equip that item"
// -> (Done) Could use same ChatMessageData interface to this and just append to client's chatHistory
// -> (Meh) Make more sense if we call it messageHistory?
// -> (Done) Add color field to chatMessageData interface. Player chats - white, notifications - red, server notifications - yellow, etc.
// -> (Done) System is username so i.e. [System]: Inventory full. in red font.
// TODO: (Done) Make chat window and input wider, chat display taller.
// TODO: (Done) max msgs (more) for focused, max msgs (less) for unfocused 
// TODO: (Done) Add blur / focus back with clicking. I like it

// Future feature expansions (as of 03/19/2023):
// TODO: Chat bubble over player's heads.
// -> Reposition nameplates or just do bubbles on top?
// TODO: Bleep out banned keywords
// TODO (stretch): Input box text overflow - using scissors. Would be good knoweldge for scrollbar stuff too
// TODO (stretch): Scrollable chat history - using scissors.
// TODO (stretch): Wrapping message. Max of 2 lines.
// TODO (stretch): /slash commands for things like direct messaging: /msg [Gizmolo] Hello.
// -> Direct Messages come in different font colors (teal / light blue). Can message people cross worlds.
// -> Mod commands like /spawn [Goblin lv3]
// TODO (maybe): Add timestamps at beg of messages.
// TODO (maybe): Make chat window font size smaller.
// TODO (maybe): Display Player / Client Ids.

interface Props {
    top?: string | number;
    left?: string | number;
    chatHistory: ChatHistory;
    color: string;
    opacity: string | number;
    inputBoxContents: string;
    inputBoxFocused: boolean;
    lastCharacterIsTextCursor: boolean;
    maxChatHistoryLength: number;
    chatInputBackspace: () => void;
    setFocus: (toggle: boolean) => void;
}

interface State {
    chatHistoryWithMetaData: Array<ChatHistoryWithMetaData>;
    charactersRemaining: number;
    charactersRemainingFontColor: string;
    charactersRemainingTop: number;
    charactersRemainingLeft: number;
}

interface ChatHistoryWithMetaData extends ChatMessageData {
    displayInUnfocusedView?: boolean;
}

export class Chat extends Component<Props, State> {
    unfocusedViewMessageRenderTime = 15000;
    maxNumberOfMessagesToDisplayFocused = 15;
    maxNumberOfMessagesToDisplayUnfocused = 7;
    maxCharacters = 50;
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            chatHistoryWithMetaData: [],
            charactersRemaining: this.maxCharacters,
            charactersRemainingFontColor: "#5A5A5A",
            charactersRemainingTop: 412,
            charactersRemainingLeft: 625,
        }
    }

    componentDidUpdate = (prevProps: Props) => {
        if (prevProps.chatHistory.length !== this.props.chatHistory.length) {
            this.updateChatHistoryWithMetaData()
        }

        if (prevProps.inputBoxContents.length !== this.props.inputBoxContents.length) {
            this.updateCharactersRemainingText()
        }
    }

    updateChatHistoryWithMetaData = () => {
        // New message will be the most recently appended element on the chatHistory array.
        const newMessage: ChatHistoryWithMetaData = this.props.chatHistory[this.props.chatHistory.length - 1]
        newMessage.displayInUnfocusedView = true

        // We want our internal chatHistory array to be reversed so prepend newMessage to chatHistory.
        if (this.state.chatHistoryWithMetaData.length > this.props.maxChatHistoryLength) {
            this.setState({
                chatHistoryWithMetaData: [newMessage].concat(this.state.chatHistoryWithMetaData.slice(0, this.props.maxChatHistoryLength - 1))
            })
        } else {
            this.setState({
                chatHistoryWithMetaData: [newMessage].concat(this.state.chatHistoryWithMetaData)
            })
        }
        
        // Set timeout for unfocused view message render. Set state to force a re-render.
        setTimeout(() => {
            newMessage.displayInUnfocusedView = false
            this.setState({
                chatHistoryWithMetaData: [...this.state.chatHistoryWithMetaData]
            })
        }, this.unfocusedViewMessageRenderTime)
    }

    updateCharactersRemainingText = () => {
        if (!this.props.lastCharacterIsTextCursor) {
            const charactersTypedWithoutTextCursor = this.maxCharacters - this.props.inputBoxContents.length + 1
            if (this.state.charactersRemaining !== charactersTypedWithoutTextCursor) {
                this.setState({
                    charactersRemaining: charactersTypedWithoutTextCursor
                })

                this.setCharactersRemainingFontColor();
            }
        } else {
            const charactersTypedWithTextCursor = this.maxCharacters - this.props.inputBoxContents.length + 2
            if (this.state.charactersRemaining !== charactersTypedWithTextCursor) {
                this.setState({
                    charactersRemaining: charactersTypedWithTextCursor
                })

                this.setCharactersRemainingFontColor();
            }
        }

        // If max char limit reached, backspace next typed char.
        if (this.state.charactersRemaining < 0) {
            this.props.chatInputBackspace()
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

    renderChatHistoryWithMetaData = () => {
        const currentTopOffset = 370
        const messageSpacing = 25
        
        return this.state.chatHistoryWithMetaData.map((chatMsgData, index) => {
            if ((index < this.maxNumberOfMessagesToDisplayUnfocused && chatMsgData.displayInUnfocusedView) || (index < this.maxNumberOfMessagesToDisplayFocused && this.props.inputBoxFocused)) {
                return (<Text
                    top={currentTopOffset - (index*messageSpacing)} 
                    left={5} 
                    contents={`[${chatMsgData.clientUsername}]: ${chatMsgData.chatMessage}`}
                    fontColor={chatMsgData.chatFontColor}>
                </Text>)
            } else
                return (<label></label>)
        })
    }

    renderCharactersRemaining = () => {
        if (this.props.inputBoxFocused)
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
            <panel top={this.props.top} left={this.props.left}>
                <panel
                    height="375"
                    width="650"
                    color={this.props.color}
                    opacity={this.props.inputBoxFocused ? this.props.opacity : 0.001 }>
                </panel>

                <ChatInputBox
                    boxColor={this.props.color}
                    opacity="0.75"
                    top="392"
                    left="0"
                    fontTop="23"
                    width="650"
                    height="30"
                    focused={this.props.inputBoxFocused}
                    contents={this.props.inputBoxContents}
                    setFocus={this.props.setFocus}
                />

                {this.renderCharactersRemaining()}

                {/* This needs to happen after all main chat UI has rendered, less we trigger unwanted re-renders. */}
                {this.renderChatHistoryWithMetaData()}
            </panel>
        );
    }
}