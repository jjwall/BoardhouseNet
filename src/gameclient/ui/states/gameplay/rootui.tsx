import { NotificationData } from "../../../../packets/data/notificationdata";
import { UIEventTypes } from "../../../../packets/enums/uieventtypes";
import { createJSXElement } from "../../core/createjsxelement";
import { ItemData } from "../../../../packets/data/itemdata";
import { NotificationWidget } from "./notificationwidget";
import { InputBox } from "../../basecomponents/inputbox";
import { renderWidget } from "../../core/renderwidget";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Inventory } from "./inventory";
import { Scene } from "three";
import { HUD } from "./hud";

let textReticleInterval: NodeJS.Timeout = undefined

export type UIEvents = Array<UIEventTypes>
export type ClientInventory = Array<ItemData | undefined>

export interface StatsStateParams {
    level?: number
    maxHp?: number;
    currentHp?: number;
    maxMp?: number;
    currentMp?: number;
    maxXp?: number;
    currentXp?: number;
}

export function renderGamePlayUi(scene: Scene, rootWidget: Widget, props: Props): Root {
    let rootInstance = renderWidget(<Root { ...props }/>, rootWidget, scene);

    return rootInstance.component as Root;
}

export interface GlobalState {
    // Misc
    uiEvents: UIEvents
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
}

interface Props {
    initialState: GlobalState
}

export class Root extends Component<Props, GlobalState> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            uiEvents: props.initialState.uiEvents,
            clientInventory: props.initialState.clientInventory,
            inventoryViewToggle: props.initialState.inventoryViewToggle,
            inventoryTop: props.initialState.inventoryTop,
            notificationMessage: props.initialState.notificationMessage,
            level: props.initialState.level,
            maxHP: props.initialState.maxHP,
            currentHP: props.initialState.currentHP,
            maxMP: props.initialState.maxMP,
            currentMP: props.initialState.currentMP,
            maxXP: props.initialState.maxXP,
            currentXP: props.initialState.currentXP,
            chatInputBoxContents: props.initialState.chatInputBoxContents,
            chatFocused: props.initialState.chatFocused,
        };
    }

    getState() {
        return this.state
    }

    backspaceChatInputBoxContents = () => {
        if (this.state.chatInputBoxContents.length > 1) {
            this.setState({
                chatInputBoxContents: this.state.chatInputBoxContents.slice(0, this.state.chatInputBoxContents.length - 1)
            })
        } else if (this.state.chatInputBoxContents.length === 1 && this.state.chatInputBoxContents !== " ") {
            this.setState({
                chatInputBoxContents: " " // Workaround, empty string doesn't play well.
            })
        }
    }

    setChatInputBoxContents = (newContents: string) => {
        // check for backspace, and remove if exists? Make special cases for other keys like tab, ctrl, etc.
        this.setState({
            chatInputBoxContents: this.state.chatInputBoxContents += newContents
        })
    }

    setChatFocus = (toggle: boolean) => {
        this.setState({
            chatFocused: toggle
        })

        if (toggle) {
            textReticleInterval = setInterval(() => {
                if (this.state.chatInputBoxContents.substring(this.state.chatInputBoxContents.length - 1, this.state.chatInputBoxContents.length) === "|") {
                    this.backspaceChatInputBoxContents();
                } else {
                    this.setChatInputBoxContents("|");
                }
            }, 500)
        } else {
            clearInterval(textReticleInterval)

            if (this.state.chatInputBoxContents.substring(this.state.chatInputBoxContents.length - 1, this.state.chatInputBoxContents.length) === "|") {
                this.backspaceChatInputBoxContents();
            }
        }
    }

    updateStats = (params: StatsStateParams) => {
        if (params.level)
            this.setState({
                level: params.level
            })

        if (params.currentHp)
            this.setState({
                currentHP: params.currentHp
            })

        if (params.maxHp)
            this.setState({
                maxHP: params.maxHp
            })
        
        if (params.currentMp)
            this.setState({
                currentMP: params.currentMp
            })

        if (params.maxMp)
            this.setState({
                maxMP: params.maxMp
            })

        if (params.currentXp)
            this.setState({
                currentXP: params.currentXp
            })

        if (params.maxXp)
            this.setState({
                maxXP: params.maxXp
            })
    }

    setUIEvents = (newUIEvents: UIEvents) => {
        this.setState({
            uiEvents: newUIEvents
        })
    }

    setClientInventory = (newClientInventory: ClientInventory) => {
        this.setState({
            clientInventory: newClientInventory
        })
    }

    setInventoryViewToggle = (toggle: boolean) => {
        this.setState({
            inventoryViewToggle: toggle
        })

        if (this.state.inventoryViewToggle)
            this.setState({
                inventoryTop: 456
            })
        else
            this.setState({
                inventoryTop: 639
            })
    }

    // Todo: Shouldn't have "clientId" field from the data interface.
    // Todo: Don't like setTimeout implementation - use a message box eventually.
    setNotificationMessage = (newNotificationMessage: NotificationData) => {
        this.setState({
            notificationMessage: newNotificationMessage
        })

        setTimeout(() => {
            this.setState({
                notificationMessage: {
                    milliseconds: 0,
                    color: "",
                    clientId: "", // unnecessary
                    notification: " " // needs space to clear
                }
            })
        }, newNotificationMessage.milliseconds)
    }

    // setHUDState -> split into multiple parts?

    render(): JSXElement {
        return(
            <panel>
                <InputBox
                    boxColor="#C9CFFF"
                    borderColor="#000000"
                    top="600"
                    left="100"
                    fontTop="18"
                    width={250}
                    height={25}
                    setFocus={this.setChatFocus}
                    focused={this.state.chatFocused}
                    contents={this.state.chatInputBoxContents}
                />
                <HUD
                    level={this.state.level}
                    maxHP={this.state.maxHP}
                    currentHP={this.state.currentHP}
                    maxMP={this.state.maxMP}
                    currentMP={this.state.currentMP}
                    maxXP={this.state.maxXP}
                    currentXP={this.state.currentXP}
                />
                <NotificationWidget
                    message={this.state.notificationMessage.notification}
                    color={this.state.notificationMessage.color}
                />
                <Inventory
                    top={this.state.inventoryTop}
                    left="975"
                    color="#282828"
                    opacity="0.5"
                    draggingDisabled={!this.state.inventoryViewToggle}
                    clientInventory={this.state.clientInventory}
                    setUIEvents={this.setUIEvents}
                    setClientInventory={this.setClientInventory}
                    setNotificationMessage={this.setNotificationMessage}
                />
            </panel>
        )
    }
}