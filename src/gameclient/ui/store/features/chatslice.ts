import { ChatMessageData } from "../../../../packets/data/chatmessagedata";
import { globalGameContext } from "./../context/globalgamecontext";
import { client } from "../../../../gameclient/clientengine/main";
import { APPEND_CHAT_HISTORY } from "./../core/actiontypes";
import { createStore } from "./../core/createstore";

type ChatState = {
    chatHistory?: ChatMessageData[]
}

type ChatAction = {
    type: string
    chatMessageData?: ChatMessageData
}

const initialState: ChatState = {
	chatHistory: [],
}

const chatReducer = (
		state: ChatState = initialState, 
		action: ChatAction
): ChatState => {
	switch (action.type) {
		case APPEND_CHAT_HISTORY:
			return {
				chatHistory: state.chatHistory.concat(action.chatMessageData)
			};

		default:
			return state;
	}
};

const chatHistoryStore = createStore(chatReducer)

/* TODO: Check for max here?
Or don't store whole chatHistory array, just nextMessage to be appended...
In the past in our root we were doing:

    if (this.state.chatHistory.length > this.maxChatHistoryLength){
        this.setState({
            chatHistory: this.state.chatHistory.slice(1, this.maxChatHistoryLength).concat(newChatMessage)
        })
    } else {
        this.setState({
            chatHistory: this.state.chatHistory.concat(newChatMessage)
        })
    }

*/
const appendHistory = (newChatMessage: ChatMessageData) => {
	const chatHistoryAction: ChatAction = {
		type: APPEND_CHAT_HISTORY,
		chatMessageData: newChatMessage
	}
	chatHistoryStore.dispatch(chatHistoryAction)
	globalGameContext.chatHistory = chatHistoryStore.getState().chatHistory
	client.setUIGameContext({ ...globalGameContext })
}

export const chatSlice = {
    appendHistory,
}
