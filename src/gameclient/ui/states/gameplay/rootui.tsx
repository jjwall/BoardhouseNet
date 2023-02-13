import { NotificationData } from "../../../../packets/data/notificationdata";
import { UIEventTypes } from "../../../../packets/enums/uieventtypes";
import { createJSXElement } from "../../core/createjsxelement";
import { ItemData } from "../../../../packets/data/itemdata";
import { NotificationWidget } from "./notificationwidget";
import { renderWidget } from "../../core/renderwidget";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Inventory } from "./inventory";
import { Scene } from "three";

export type UIEvents = Array<UIEventTypes>
export type ClientInventory = Array<ItemData | undefined>

export function renderGamePlayUi(scene: Scene, rootWidget: Widget, props: Props): Root {
    let rootInstance = renderWidget(<Root { ...props }/>, rootWidget, scene);

    return rootInstance.component as Root;
}

interface GlobalState {
    uiEvents: UIEvents
    clientInventory: ClientInventory
    notificationMessage: NotificationData
    inventoryViewToggle: boolean
    inventoryTop: string | number
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
        };
    }

    getState() {
        return this.state
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

    render(): JSXElement {
        return(
            <panel>
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