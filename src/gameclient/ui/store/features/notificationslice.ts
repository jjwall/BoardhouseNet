import { NotificationData } from "../../../../packets/data/notificationdata";
import { globalGameContext } from "./../context/globalgamecontext";
import { client } from "../../../../gameclient/clientengine/main";
import { NOTIFICATION_UPDATE } from "./../core/actiontypes";
import { createStore } from "./../core/createstore";

type NotificationState = {
	data?: NotificationData
}

type NotificationAction = {
    type: string
    data?: NotificationData
}

const initialState: NotificationState = {
	data: undefined,
}

const notificationReducer = (
		state: NotificationState = initialState, 
		action: NotificationAction
): NotificationState => {
	switch (action.type) {
		case NOTIFICATION_UPDATE:
			return {
				data: action.data
			};

		default:
			return state;
	}
};

const notificationStore = createStore(notificationReducer)

const update = (newNotification: NotificationData) => {
	const notificationAction: NotificationAction = {
		type: NOTIFICATION_UPDATE,
		data: newNotification
	}
	notificationStore.dispatch(notificationAction)
	globalGameContext.notificationMessage = notificationStore.getState().data
	client.setUIGameContext({ ...globalGameContext })
}

export const notificationSlice = {
	update,
}
