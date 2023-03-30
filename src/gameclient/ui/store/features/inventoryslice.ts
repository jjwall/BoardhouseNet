import { globalGameContext } from "./../context/globalgamecontext";
import { client } from "../../../../gameclient/clientengine/main";
import { INVENTORY_TOGGLE_VIEW } from "./../core/actiontypes";
import { createStore } from "./../core/createstore";

type InventoryState = {
    toggleView?: boolean
}

type InventoryAction = {
    type: string
    toggleView?: boolean
}

const initialState: InventoryState = {
	toggleView: false,
}

const inventoryReducer = (
		state: InventoryState = initialState, 
		action: InventoryAction
): InventoryState => {
	switch (action.type) {
		case INVENTORY_TOGGLE_VIEW:
			return {
				toggleView: action.toggleView
			};

		default:
			return state;
	}
};

const inventoryStore = createStore(inventoryReducer)

const toggleView = (toggle: boolean) => {
	const inventoryAction: InventoryAction = {
		type: INVENTORY_TOGGLE_VIEW,
		toggleView: toggle
	}
	inventoryStore.dispatch(inventoryAction)
	globalGameContext.inventoryViewToggle = inventoryStore.getState().toggleView
	client.setUIGameContext({ ...globalGameContext })
}

export const inventorySlice = {
    toggleView,
}
