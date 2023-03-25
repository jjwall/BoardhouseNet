import { ChatMessageData } from "../../../packets/data/chatmessagedata";
import { Client } from "../../../gameclient/clientengine/client";
import { ChatHistoryAction, ChatHistoryState } from "./actions";
import { APPEND_CHAT_HISTORY } from "./actiontypes";
import { initialGameContext } from "./context";
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

export const appendChatHistory2 = (client: Client, newChatMessage: ChatMessageData) => {
	// if (this.state.chatHistory.length > this.maxChatHistoryLength){
	//     this.setState({
	//         chatHistory: this.state.chatHistory.slice(1, this.maxChatHistoryLength).concat(newChatMessage)
	//     })
	// } else {
	//     this.setState({
	//         chatHistory: this.state.chatHistory.concat(newChatMessage)
	//     })
	// }
	const chatHistoryAction: ChatHistoryAction = {
		type: APPEND_CHAT_HISTORY,
		chatMessageData: newChatMessage
	}
	chatHistoryStore.dispatch(chatHistoryAction)
	console.log("CHECK HERE RE RERE RE RE RE ")
	initialGameContext.chatHistory = chatHistoryStore.getState().chatHistory // testing
	console.log(chatHistoryStore.getState())
	// client.setUIGameContext(chatHistoryStore.getState())
	// client.setUIGameContext({ initialState: client.currentContext })
	client.setUIGameContext(client.currentContext)
	console.log(chatHistoryStore.getState())
}