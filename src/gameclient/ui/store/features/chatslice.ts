import { ChatMessageData } from "../../../../packets/data/chatmessagedata";
import { Client } from "../../../../gameclient/clientengine/client";
import { globalGameContext } from "./../context/globalgamecontext";
import { APPEND_CHAT_HISTORY } from "./../core/actiontypes";
import { createStore } from "./../core/createstore";

type ChatHistoryState = {
    chatHistory: ChatMessageData[]
}

type ChatHistoryAction = {
    type: string
    chatMessageData: ChatMessageData
}

const chatHistoryReducer = (
		state: ChatHistoryState = { chatHistory: [] }, 
		action: ChatHistoryAction
): ChatHistoryState => {
	switch (action.type) {
		case APPEND_CHAT_HISTORY:
			return {
				chatHistory: state.chatHistory.concat(action.chatMessageData)
			};

		default:
			return state;
	}
};

const chatHistoryStore = createStore(chatHistoryReducer)

const appendHistory = (client: Client, newChatMessage: ChatMessageData) => {
	const chatHistoryAction: ChatHistoryAction = {
		type: APPEND_CHAT_HISTORY,
		chatMessageData: newChatMessage
	}
	chatHistoryStore.dispatch(chatHistoryAction)
	globalGameContext.chatHistory = chatHistoryStore.getState().chatHistory
	client.setUIGameContext(client.currentContext)
}

export const chatSlice = {
    appendHistory,
}
