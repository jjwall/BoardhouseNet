import { ChatMessageData } from "../../../../packets/data/chatmessagedata";
import { Client } from "../../../../gameclient/clientengine/client";
import { globalGameContext } from "./../context/globalgamecontext";
import { client } from "../../../../gameclient/clientengine/main";
import { CHAT_INPUT_BOX_KEYSTROKE, CHAT_INPUT_BOX_UPDATE_CONTENTS, FOCUS_CHAT_INPUT_BOX } from "./../core/actiontypes";
import { createStore } from "./../core/createstore";

type ChatInputBoxState = {
    focused?: boolean,
    keystroke?: string[],
    contents?: string,
}

type ChatInputBoxAction = {
    type: string
    focused?: boolean
    keystroke?: string[]
    contents?: string
}

const initialState: ChatInputBoxState = {
    focused: false,
    keystroke: undefined,
    contents: "",
}

const chatInputBoxReducer = (
		state: ChatInputBoxState = initialState, 
		action: ChatInputBoxAction
): ChatInputBoxState => {
	switch (action.type) {
		case FOCUS_CHAT_INPUT_BOX:
			return {
				focused: action.focused
			};
        case CHAT_INPUT_BOX_KEYSTROKE:
            return {
                keystroke: action.keystroke
            }
        case CHAT_INPUT_BOX_UPDATE_CONTENTS:
            return {
                contents: action.contents
            }
		default:
			return state;
	}
};

const chatInputBoxStore = createStore(chatInputBoxReducer)

const setKeystroke = (keystroke: string) => {
    const chatInputBoxAction: ChatInputBoxAction = {
		type: CHAT_INPUT_BOX_KEYSTROKE,
		keystroke: [keystroke],
	}

    chatInputBoxStore.dispatch(chatInputBoxAction)
    globalGameContext.chatCurrentKeystroke = chatInputBoxStore.getState().keystroke
    if (chatInputBoxStore.getState().keystroke.length > 0) {
        client.setUIGameContext({
            ...globalGameContext, 
            chatCurrentKeystroke: [chatInputBoxStore.getState().keystroke[0]] 
        })
    }
}

const setContents = (contents: string) => {
    const chatInputBoxAction: ChatInputBoxAction = {
		type: CHAT_INPUT_BOX_UPDATE_CONTENTS,
		contents: contents,
	}
    chatInputBoxStore.dispatch(chatInputBoxAction)
    globalGameContext.chatInputBoxContents = chatInputBoxStore.getState().contents
    client.setUIGameContext({ ...globalGameContext })
}

const setFocus = (focused: boolean) => {
    const chatInputBoxAction: ChatInputBoxAction = {
		type: FOCUS_CHAT_INPUT_BOX,
		focused: focused,
	}
    chatInputBoxStore.dispatch(chatInputBoxAction)
    globalGameContext.chatFocused = chatInputBoxStore.getState().focused
    client.setUIGameContext({ ...globalGameContext })
    // client.setUIGameContext(client.currentContext) // old test
}

// const appendHistory = (client: Client, newChatMessage: ChatMessageData) => {
// 	const chatHistoryAction: ChatInputBoxAction = {
// 		type: APPEND_CHAT_HISTORY,
// 		chatMessageData: newChatMessage
// 	}
// 	chatInputBoxStore.dispatch(chatHistoryAction)
// 	globalGameContext.chatHistory = chatInputBoxStore.getState().chatHistory
// 	client.setUIGameContext(client.currentContext)
// }

export const chatInputBoxSlice = {
    setFocus,
    setKeystroke,
    setContents,
}
