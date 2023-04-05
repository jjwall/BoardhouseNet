import { globalGameContext } from "./../context/globalgamecontext";
import { client } from "../../../../gameclient/clientengine/main";
import { createStore } from "./../core/createstore";
import { 
    HUD_UPDATE_CURRENT_HP, 
    HUD_UPDATE_CURRENT_MP, 
    HUD_UPDATE_CURRENT_XP, 
    HUD_UPDATE_LEVEL, 
    HUD_UPDATE_MAX_HP, 
    HUD_UPDATE_MAX_MP, 
    HUD_UPDATE_MAX_XP 
} from "./../core/actiontypes";

type HUDState = {
    level?: number;
    maxHP?: number;
    currentHP?: number;
    maxMP?: number;
    currentMP?: number;
    maxXP?: number;
    currentXP?: number;
}

type HUDAction = {
    type: string
    level?: number;
    maxHP?: number;
    currentHP?: number;
    maxMP?: number;
    currentMP?: number;
    maxXP?: number;
    currentXP?: number;
}

const initialState: HUDState = {
    level: 0,
    maxHP: 0,
    currentHP: 0,
    maxMP: 0,
    currentMP: 0,
    maxXP: 0,
    currentXP: 0,
}

const HUDReducer = (
		state: HUDState = initialState, 
		action: HUDAction
): HUDState => {
	switch (action.type) {
        case HUD_UPDATE_LEVEL:
            return {
                level: action.level
            }

		case HUD_UPDATE_CURRENT_HP:
			return {
				currentHP: action.currentHP
			};

        case HUD_UPDATE_MAX_HP:
            return {
                maxHP: action.maxHP
            };

        case HUD_UPDATE_CURRENT_MP:
            return {
                currentMP: action.currentMP
            };

        case HUD_UPDATE_MAX_MP:
            return {
                maxMP: action.maxMP
            };

        case HUD_UPDATE_CURRENT_XP:
            return {
                currentXP: action.currentXP
            };

        case HUD_UPDATE_MAX_XP:
            return {
                maxXP: action.maxXP
            };

		default:
			return state;
	}
};

const HUDStore = createStore(HUDReducer)

const updateCurrentHP = (newCurrentHP: number) => {
	const HUDAction: HUDAction = {
		type: HUD_UPDATE_CURRENT_HP,
		currentHP: newCurrentHP
	}
	HUDStore.dispatch(HUDAction)
	globalGameContext.currentHP = HUDStore.getState().currentHP
	client.setUIGameContext({ ...globalGameContext })
}

const updateMaxHP = (newMaxHP: number) => {
	const HUDAction: HUDAction = {
		type: HUD_UPDATE_MAX_HP,
		maxHP: newMaxHP
	}
	HUDStore.dispatch(HUDAction)
	globalGameContext.maxHP = HUDStore.getState().maxHP
	client.setUIGameContext({ ...globalGameContext })
}

const updateCurrentMP = (newCurrentMP: number) => {
	const HUDAction: HUDAction = {
		type: HUD_UPDATE_CURRENT_MP,
		currentMP: newCurrentMP
	}
	HUDStore.dispatch(HUDAction)
	globalGameContext.currentMP = HUDStore.getState().currentMP
	client.setUIGameContext({ ...globalGameContext })
}

const updateMaxMP = (newMaxMP: number) => {
	const HUDAction: HUDAction = {
		type: HUD_UPDATE_MAX_MP,
		maxMP: newMaxMP
	}
	HUDStore.dispatch(HUDAction)
	globalGameContext.maxMP = HUDStore.getState().maxMP
	client.setUIGameContext({ ...globalGameContext })
}

const updateCurrentXP = (newCurrentXP: number) => {
	const HUDAction: HUDAction = {
		type: HUD_UPDATE_CURRENT_XP,
		currentXP: newCurrentXP
	}
	HUDStore.dispatch(HUDAction)
	globalGameContext.currentXP = HUDStore.getState().currentXP
	client.setUIGameContext({ ...globalGameContext })
}

const updateMaxXP = (newMaxXP: number) => {
	const HUDAction: HUDAction = {
		type: HUD_UPDATE_MAX_XP,
		maxXP: newMaxXP
	}
	HUDStore.dispatch(HUDAction)
	globalGameContext.maxXP = HUDStore.getState().maxXP
	client.setUIGameContext({ ...globalGameContext })
}

const updateLevel = (level: number) => {
	const HUDAction: HUDAction = {
		type: HUD_UPDATE_LEVEL,
		level: level
	}
	HUDStore.dispatch(HUDAction)
	globalGameContext.level = HUDStore.getState().level
	client.setUIGameContext({ ...globalGameContext })
}

export const HUDSlice = {
    updateLevel,
	updateCurrentHP,
    updateMaxHP,
    updateCurrentMP,
    updateMaxMP,
    updateCurrentXP,
    updateMaxXP
}
