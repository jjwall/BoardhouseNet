import { createJSXElement } from "../core/createjsxelement";
import { JSXElement } from "../core/interfaces";
import { Component } from "../core/component";
import { Scene } from "THREE";

interface Props {
    top?: string | number;
    left?: string | number;
    baseColor?: string;
    barColor?: string;
    baseWidth: number;
    baseHeight: number;
    maxUnits: number;
    currentUnits: number;
}

interface State {
    maxBarWidth: number;
}

export class ProgressBar extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            maxBarWidth: this.props.baseWidth - 4,
        }
    }

    getCurrentBarWidth = () => {
        return (this.props.currentUnits / this.props.maxUnits) * this.state.maxBarWidth
    }

    render(): JSXElement {
        return (
            <panel top={this.props.top} left={this.props.left} height={this.props.baseHeight} width={this.props.baseWidth} color={this.props.baseColor ?? "#282828"} opacity={0.75}>
                <panel top={2} left={2} height={this.props.baseHeight - 4} width={this.getCurrentBarWidth()} color={this.props.barColor ?? "#A9A9A9"} opacity={1}></panel>
            </panel>
        );
    }
}