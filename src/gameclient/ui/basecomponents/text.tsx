import { createJSXElement } from "../core/createjsxelement";
import { JSXElement } from "../core/interfaces";
import { Component } from "../core/component";
import { Scene } from "THREE";

interface Props {
    contents: string,
    top: string | number,
    left: string | number,
    fontColor?: string,
    fontShadowColor?: string,
    fontSize?: string | number,
    font?: string;
}

export class Text extends Component<Props, {}> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    render(): JSXElement {
        return (
            <panel>
                <label top={this.props.top} left={Number(this.props.left) - 1} font_size={Number(this.props.fontSize)} color={this.props.fontShadowColor} contents={this.props.contents}></label>
                <label top={Number(this.props.top) - 1} left={this.props.left} font_size={Number(this.props.fontSize)} color={this.props.fontColor ?? "#FFFFFF"} contents={this.props.contents}></label>
            </panel>
        )
    }
}