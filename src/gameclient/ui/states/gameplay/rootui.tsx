import { NotificationData } from "../../../../packets/data/notificationdata";
import { createJSXElement } from "../../core/createjsxelement";
import { ItemData } from "../../../../packets/data/itemdata";
import { NotificationWidget } from "./notificationwidget";
import { renderWidget } from "../../core/renderwidget";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Inventory } from "./inventory";
import { Scene } from "three";

export type ClientInventory = Array<ItemData | undefined>

export function renderGamePlayUi(scene: Scene, rootWidget: Widget, props: Props): Root {
    let rootInstance = renderWidget(<Root { ...props }/>, rootWidget, scene);

    return rootInstance.component as Root;
}

interface GlobalState {
    clientInventory: ClientInventory
    notificationMessage: NotificationData
}

interface Props {
    initialState: GlobalState
}

export class Root extends Component<Props, GlobalState> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            clientInventory: props.initialState.clientInventory,
            notificationMessage: props.initialState.notificationMessage,
        };
    }

    getState() {
        return this.state
    }

    setClientInventory = (newClientInventory: ClientInventory) => {
        this.setState({
            clientInventory: newClientInventory
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
                    top="550"
                    left="975"
                    color="#282828"
                    opacity="0.5"
                    clientInventory={this.state.clientInventory}
                    setClientInventory={this.setClientInventory}
                />
            </panel>
        )
    }
}