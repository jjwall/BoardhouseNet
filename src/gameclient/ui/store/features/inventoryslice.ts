import { globalGameContext } from "./../context/globalgamecontext";
import { client } from "../../../../gameclient/clientengine/main";
import { INVENTORY_TOGGLE_VIEW, INVENTORY_UPDATE } from "./../core/actiontypes";
import { ItemData } from "../../../../packets/data/itemdata";
import { createStore } from "./../core/createstore";

type InventoryState = {
    toggleView?: boolean
	inventory?: ItemData[]
}

type InventoryAction = {
    type: string
    toggleView?: boolean
	inventory?: ItemData[]
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

		case INVENTORY_UPDATE:
			return {
				inventory: action.inventory
			}
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

const update = (newInventory: ItemData[]) => {
	const inventoryAction: InventoryAction = {
		type: INVENTORY_UPDATE,
		inventory: newInventory
	}
	inventoryStore.dispatch(inventoryAction)
	globalGameContext.clientInventory = inventoryStore.getState().inventory
	client.setUIGameContext({ ...globalGameContext })
}

export const inventorySlice = {
    toggleView,
	update,
}
