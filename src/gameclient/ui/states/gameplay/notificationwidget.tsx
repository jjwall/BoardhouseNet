import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Scene } from "three";
import { Text } from "../../basecomponents/text";

interface Props {
    color: string
    message: string
}

interface State {}

export class NotificationWidget extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    render(): JSXElement {
        return (
            // May need "center" attribute in future.
            <Text
                fontSize="24"
                left="640"
                top="150"
                fontColor={this.props.color}
                contents={this.props.message}
            />
        )
    }
}
