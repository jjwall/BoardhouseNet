import { presetEmptyInventory } from "../../../../database/inventory/preset_emptyinventory";
import { NotificationData } from "../../../../packets/data/notificationdata";
import { ChatMessageData } from "../../../../packets/data/chatmessagedata";
import { ItemData } from "../../../../packets/data/itemdata";

export interface GlobalGameState {
    // Misc
    notificationMessage: NotificationData
    // Inventory
    clientInventory: ItemData[]
    inventoryViewToggle: boolean
    inventoryTop: string | number
    // HUD
    level: number;
    maxHP: number;
    currentHP: number;
    maxMP: number;
    currentMP: number;
    maxXP: number;
    currentXP: number;
    // Chat
    chatCurrentKeystroke: string[]; // single string value
    chatInputBoxContents: string;
    chatFocused: boolean;
    chatHistory: ChatMessageData[];
    onChatSubmit: (contents: string) => void
    onItemEquip: (newInventory: ItemData[]) => void
    onPlay: () => void
    // onSpectate: () => void
}

// TODO: Thinking about this more... if we ever want to "unload" ui
// in the midst of someone's gameplay, this initial state will be invalid
// we would have to pass around a ui state object through
// player world transition messages and what not
export const globalGameContext: GlobalGameState = {
    // Using preset client inventory for now.
    // In future pull from database or pre-set data set.
    // Todo: Load from playerJoinData ? - yes - yes

    // Misc
    notificationMessage: {
        milliseconds: 0,
        color: "",
        clientId: "", // unnecessary
        notification: ""
    },
    // Inventory
    clientInventory: presetEmptyInventory,
    inventoryViewToggle: true,
    inventoryTop: 456,
    // HUD
    level: 0,
    maxHP: 0,
    currentHP: 0,
    maxMP: 0,
    currentMP: 0,
    maxXP: 0,
    currentXP: 0,
    // Chat
    chatCurrentKeystroke: [],
    chatInputBoxContents: " ",
    chatFocused: false,
    chatHistory: [],
    onChatSubmit: undefined,
    onItemEquip: undefined,
    onPlay: undefined
}