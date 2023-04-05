import { NotificationData } from "../../../../packets/data/notificationdata";
import { ChatMessageData } from "../../../../packets/data/chatmessagedata";
import { createJSXElement } from "../../core/createjsxelement";
import { ItemData } from "../../../../packets/data/itemdata";
import { NotificationWidget } from "./notificationwidget";
import { renderWidget } from "../../core/renderwidget";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Inventory } from "./inventory";
import { Scene } from "three";
import { Chat } from "./chat";
import { HUD } from "./hud";

export type ClientInventory = Array<ItemData | undefined>
export type ChatHistory = Array<ChatMessageData>

export interface StatsStateParams {
    level?: number
    maxHp?: number;
    currentHp?: number;
    maxMp?: number;
    currentMp?: number;
    maxXp?: number;
    currentXp?: number;
}

export function renderGamePlayUi(scene: Scene, rootWidget: Widget, props: Props): GameplayRoot {
    let rootInstance = renderWidget(<GameplayRoot { ...props }/>, rootWidget, scene);

    return rootInstance.component as GameplayRoot;
}

// This will be refactored into store/context
export interface GlobalState { // should be GameState
    // Misc
    notificationMessage: NotificationData
    // Inventory
    clientInventory: ClientInventory
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
    chatInputBoxContents: string;
    chatFocused: boolean;
    chatHistory: ChatHistory;
}

interface Props {
    globalGameState: GlobalState
}

export class GameplayRoot extends Component<Props, GlobalState> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            clientInventory: props.globalGameState.clientInventory,
            inventoryViewToggle: props.globalGameState.inventoryViewToggle,
            inventoryTop: props.globalGameState.inventoryTop,
            notificationMessage: props.globalGameState.notificationMessage,
            level: props.globalGameState.level,
            maxHP: props.globalGameState.maxHP,
            currentHP: props.globalGameState.currentHP,
            maxMP: props.globalGameState.maxMP,
            currentMP: props.globalGameState.currentMP,
            maxXP: props.globalGameState.maxXP,
            currentXP: props.globalGameState.currentXP,
            chatInputBoxContents: props.globalGameState.chatInputBoxContents,
            chatFocused: props.globalGameState.chatFocused,
            chatHistory: props.globalGameState.chatHistory,
        };
    }

    /** @deprecated */
    getState = () => {
        return this.state
    }

    // updateStats = (params: StatsStateParams) => {
    //     if (params.level)
    //         this.setState({
    //             level: params.level
    //         })

    //     if (params.currentHp)
    //         this.setState({
    //             currentHP: params.currentHp
    //         })

    //     if (params.maxHp)
    //         this.setState({
    //             maxHP: params.maxHp
    //         })
        
    //     if (params.currentMp)
    //         this.setState({
    //             currentMP: params.currentMp
    //         })

    //     if (params.maxMp)
    //         this.setState({
    //             maxMP: params.maxMp
    //         })

    //     if (params.currentXp)
    //         this.setState({
    //             currentXP: params.currentXp
    //         })

    //     if (params.maxXp)
    //         this.setState({
    //             maxXP: params.maxXp
    //         })
    // }

    // setHUDState -> split into multiple parts?

    render(): JSXElement {
        return(
            <panel>
                <NotificationWidget
                    top="150"
                    left="440"
                />
                <HUD
                    top="0"
                    left="0"
                />
                <Chat
                    top="271"
                    left="24"
                    color="#282828"
                    opacity="0.5"
                />
                <Inventory
                    top="456"
                    left="975"
                    color="#282828"
                    opacity="0.5"
                />
            </panel>
        )
    }
}