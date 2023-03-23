import { ChatHistoryAction, ChatHistoryState } from "./actions";
import { APPEND_CHAT_HISTORY } from "./actiontypes";
import { createStore } from "./createstore";

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

export const chatHistoryStore = createStore(chatHistoryReducer)