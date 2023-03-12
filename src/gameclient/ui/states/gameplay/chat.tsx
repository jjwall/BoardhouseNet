import { ChatMessageData } from "../../../../packets/data/chatmessagedata";
import { createJSXElement } from "../../core/createjsxelement";
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
// TODO: (Done) Bug -> " " before chat messages b/c of workaround -> Shouldn't be able to backspace.
// Note: (Done - Edge case resolved) Input box " " space workaround means we can backspace right off the bat. Kinda annoying but ignoring for now.
// TODO: Use chat for world notifications too like "inventory full" and "You can't equip that item"
// -> Could use same ChatMessageData interface to this and just append to client's chatHistory
// -> Make more sense if we call it messageHistory?
// TODO: Add color field to chatMessageData interface. Player chats - white, notifications - red, server notifications - yellow, etc.
// TODO: (Done) Character limit render.
// TODO: (Done) Time limit on not focused chat bar.
// TODO: Chat bubble over player's heads.
// -> Reposition nameplates or just do bubbles on top?
// TODO: Add blur / focus back with clicking. I like it
// TODO: Make chat window and input wider, chat display taller.
// TODO: max msgs (more) for focused, max msgs (less) for unfocused 
// TODO: Prohibit typing more characters if max char limit reached.
// TODO: Bleep out banned keywords

// TODO (stretch): Input box text overflow... how?? z indexes? transparent layer?? Would be good knoweldge for scrollbar stuff too
// TODO (stretch): Scrollable content. - doable... but necessary?
// TODO (maybe): Add timestamps at beg of messages.
// TODO (maybe): Make chat window font size smaller

interface Props {
    top?: string | number;
    left?: string | number;
    chatHistory: ChatHistory;
    color: string
    opacity: string | number
    inputBoxContents: string;
    inputBoxFocused: boolean;
    lastCharacterIsTextCursor: boolean;
    maxChatHistoryLength: number;
    chatInputBackspace: () => void;
    setUIEvents: (newUIEvents: UIEvents) => void;
}

interface State {
    chatHistoryWithMetaData: Array<ChatHistoryWithMetaData>
    charactersRemaining: number
    charactersRemainingFontColor: string
}

interface ChatHistoryWithMetaData extends ChatMessageData {
    displayInUnfocusedView?: boolean;
}

export class Chat extends Component<Props, State> {
    unfocusedViewMessageRenderTime = 15000;
    maxNumberOfMessagesToDisplay = 7;
    maxCharacters = 50;
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            chatHistoryWithMetaData: [],
            charactersRemaining: this.maxCharacters,
            charactersRemainingFontColor: "#5A5A5A"
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
        }
    }

    setCharactersRemainingFontColor = () => {
        if (this.state.charactersRemaining >= 21) {
            this.setState({
                charactersRemainingFontColor: "#5A5A5A"
            })
        }
        else if (this.state.charactersRemaining < 21 && this.state.charactersRemaining >= 11) {
            this.setState({
                charactersRemainingFontColor: "#8B8000"
            })
        } else if (this.state.charactersRemaining < 11) {
            this.setState({
                charactersRemainingFontColor: "#811331"
            })
        }
    }

    renderChatHistoryWithMetaData = () => {
        const currentTopOffset = 185
        const messageSpacing = 25
        
        return this.state.chatHistoryWithMetaData.map((chatMsgData, index) => {
            if ((index < this.maxNumberOfMessagesToDisplay && chatMsgData.displayInUnfocusedView) || (index < this.maxNumberOfMessagesToDisplay && this.props.inputBoxFocused)) {
                return (<Text
                    top={currentTopOffset - (index*messageSpacing)} 
                    left={5} 
                    contents={`[${chatMsgData.clientUsername}]: ${chatMsgData.chatMessage}`}>
                </Text>)
            } else
                return (<label></label>)
        })
    }

    renderCharactersRemaing = () => {
        if (this.props.inputBoxFocused)
            return (<Text
                fontColor={this.state.charactersRemainingFontColor}
                fontSize="12"
                top="227"
                left="425"
                contents={this.state.charactersRemaining.toString()}>
            </Text>)
        else
            return (<label></label>)
    }

    render(): JSXElement {
        return (
            <panel top={this.props.top} left={this.props.left}>
                <panel
                    height="190"
                    width="450"
                    color={this.props.color}
                    opacity={this.props.inputBoxFocused ? this.props.opacity : 0.001 }>
                </panel>

                <ChatInputBox
                    boxColor={this.props.color}
                    opacity="0.75"
                    top="207"
                    left="0"
                    fontTop="23"
                    width="450"
                    height="30"
                    focused={this.props.inputBoxFocused}
                    contents={this.props.inputBoxContents}
                />

                {this.renderCharactersRemaing()}

                {/* This needs to happen after all main chat UI has rendered, less we trigger unwanted re-renders. */}
                {this.renderChatHistoryWithMetaData()}
            </panel>
        );
    }
}