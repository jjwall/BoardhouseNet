import { ChatMessageData } from "../../../../packets/data/chatmessagedata";
import { GlobalGameState } from "../../store/context/globalgamecontext";
import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Text } from "../../basecomponents/text";
import { ChatInputBox } from "./chatinputbox";
import { ChatHistory } from "./rootui";
import { Scene } from "THREE";

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
    // Component fields.
    top?: string | number;
    left?: string | number;
    color: string;
    opacity: string | number;
    // Context fields.
    chatHistory?: ChatHistory;
    chatFocused?: boolean;
}

interface State {
    chatHistoryWithMetaData: Array<ChatHistoryWithMetaData>;
}

interface ChatHistoryWithMetaData extends ChatMessageData {
    displayInUnfocusedView?: boolean;
}

export class Chat extends Component<Props, State> {
    maxChatHistoryLength = 32
    unfocusedViewMessageRenderTime = 15000;
    maxNumberOfMessagesToDisplayFocused = 15;
    maxNumberOfMessagesToDisplayUnfocused = 7;
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            chatHistoryWithMetaData: [],
        }
    }

    mapContextToProps(context: GlobalGameState): any {
        return { 
            chatHistory: context.chatHistory,
            chatFocused: context.chatFocused,
        }
    }

    componentDidUpdate = (prevProps: Props) => {
        if (prevProps?.chatHistory?.length !== this.props?.chatHistory?.length ) {
            this.updateChatHistoryWithMetaData()
        }
    }

    updateChatHistoryWithMetaData = () => {
        if (this.props.chatHistory.length > 0) {
            // New message will be the most recently appended element on the chatHistory array.
            const newMessage: ChatHistoryWithMetaData = this.props.chatHistory[this.props.chatHistory.length - 1]
            newMessage.displayInUnfocusedView = true

            // We want our internal chatHistory array to be reversed so prepend newMessage to chatHistory.
            if (this.state.chatHistoryWithMetaData.length > this.maxChatHistoryLength) {
                this.setState({
                    chatHistoryWithMetaData: [newMessage].concat(this.state.chatHistoryWithMetaData.slice(0, this.maxChatHistoryLength - 1))
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
    }

    renderChatHistoryWithMetaData = () => {
        const currentTopOffset = 370
        const messageSpacing = 25
        
        return this.state.chatHistoryWithMetaData.map((chatMsgData, index) => {
            if ((index < this.maxNumberOfMessagesToDisplayUnfocused && chatMsgData.displayInUnfocusedView) || (index < this.maxNumberOfMessagesToDisplayFocused && this.props.chatFocused)) {
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

    render(): JSXElement {
        return (
            <panel top={this.props.top} left={this.props.left}>
                <panel
                    height="375"
                    width="650"
                    color={this.props.color}
                    opacity={this.props.chatFocused ? this.props.opacity : 0.001 }>
                </panel>

                <ChatInputBox
                    chatFocused={this.props.chatFocused}
                    boxColor={this.props.color}
                    opacity="0.75"
                    top="392"
                    left="0"
                    fontTop="23"
                    width="650"
                    height="30"
                />

                {/* This needs to happen after all main chat UI has rendered, less we trigger unwanted re-renders. */}
                {this.renderChatHistoryWithMetaData()}
            </panel>
        );
    }
}