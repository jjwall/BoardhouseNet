import { NotificationData } from "../../../../packets/data/notificationdata";
import { GlobalGameState } from "../../store/context/globalgamecontext";
import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Text } from "../../basecomponents/text";
import { Scene } from "three";

interface Props {
    // Component props:
    top: number | string
    left: number | string
    // Context props:
    notificationMessage?: NotificationData
}

interface State {
    notificationMessageToRender: NotificationData
}

export class NotificationWidget extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            notificationMessageToRender: {
                milliseconds: 0,
                color: "",
                clientId: "",
                notification: " "
            }
        }
    }

    mapContextToProps(context: GlobalGameState): Partial<GlobalGameState> {
        return {
            notificationMessage: context.notificationMessage
        }    
    }

    componentDidUpdate(prevProps: Props, prevState: State): void {
        if (prevProps?.notificationMessage !== this.props?.notificationMessage) {
            this.setState({
                notificationMessageToRender: this.props?.notificationMessage
            })
    
            setTimeout(() => {
                this.setState({
                    notificationMessageToRender: {
                        milliseconds: 0,
                        color: "",
                        clientId: "", // unnecessary
                        notification: " " // needs space to clear
                    }
                })
            }, this.props?.notificationMessage.milliseconds)
        }    
    }

    render(): JSXElement {
        return (
            // May need "center" attribute in future.
            <Text
                fontSize="24"
                left={this.props.left}
                top={this.props.top}
                shadowOffset={2}
                fontColor={this.state.notificationMessageToRender.color}
                contents={this.state.notificationMessageToRender.notification}
            />
        )
    }
}
