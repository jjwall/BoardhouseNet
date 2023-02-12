import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Scene } from "three";

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
            <label font_size="24" top="150" left="640" color={this.props.color} contents={this.props.message}></label>
        )
    }
}
