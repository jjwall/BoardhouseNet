import { createJSXElement } from "../../core/createjsxelement";
import { ProgressBar } from "../../basecomponents/progressbar";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Text } from "../../basecomponents/text";
import { Scene } from "THREE";

interface Props {
    top?: string | number;
    left?: string | number;
    maxHP: number;
    currentHP: number;
    maxMP: number;
    currentMP: number;
    maxXP: number;
    currentXP: number;
}

export class HUD extends Component<Props, {}> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    render(): JSXElement {
        return (
            <panel top={this.props.top} left={this.props.left} height={500} width={500}>
                {/* HP Status Bar */}
                <ProgressBar
                    top={15}
                    left={15}
                    baseWidth={200}
                    baseHeight={10}
                    maxUnits={this.props.maxHP}
                    currentUnits={this.props.currentHP}
                    barColor="#c9424a" //"#cf4e55"
                />
                {/* MP Status Bar */}
                <ProgressBar
                    top={30}
                    left={15}
                    baseWidth={200}
                    baseHeight={10}
                    maxUnits={this.props.maxMP}
                    currentUnits={this.props.currentMP}
                    barColor="#1baac1"
                />
                {/* XP Status Bar */}
                <ProgressBar
                    top={45}
                    left={15}
                    baseWidth={200}
                    baseHeight={10}
                    maxUnits={this.props.maxXP}
                    currentUnits={this.props.currentXP}
                    barColor="#23b14d"
                />
                <Text
                    contents="Lv: 1" // TODO: Make leveling functionality.
                    top="75"
                    left="35"
                    fontSize="12"
                />
            </panel>
        );
    }
}