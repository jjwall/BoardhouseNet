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
                    baseWidth={250}
                    baseHeight={15}
                    maxUnits={this.props.maxHP}
                    currentUnits={this.props.currentHP}
                    barColor="#c9424a" //"#cf4e55"
                />
                <Text
                    contents="HP"
                    top={30}
                    left={270}
                    fontSize={12}
                    fontColor="#c9424a"
                />
                <Text
                    contents={this.props.currentHP.toString()}
                    top={29}
                    left={132}
                    fontSize={11}
                />
                {/* MP Status Bar */}
                <ProgressBar
                    top={35}
                    left={15}
                    baseWidth={250}
                    baseHeight={15}
                    maxUnits={this.props.maxMP}
                    currentUnits={this.props.currentMP}
                    barColor="#1baac1"
                />
                <Text
                    contents="MP"
                    top={50}
                    left={270}
                    fontSize={12}
                    fontColor="#1baac1"
                />
                <Text
                    contents={this.props.currentMP.toString()}
                    top={49}
                    left={132}
                    fontSize={11}
                />
                {/* XP Status Bar */}
                <ProgressBar
                    top={55}
                    left={15}
                    baseWidth={250}
                    baseHeight={15}
                    maxUnits={this.props.maxXP}
                    currentUnits={this.props.currentXP}
                    barColor="#23b14d"
                />
                <Text
                    contents="XP"
                    top={70}
                    left={270}
                    fontSize={12}
                    fontColor="#23b14d"
                />
                <Text
                    contents={`${Math.floor((this.props.currentXP / this.props.maxXP)*100)}%`}
                    top={69}
                    left={132}
                    fontSize={11}
                />
                <Text
                    contents="Lv: 1" // TODO: Make leveling functionality.
                    top="85"
                    left="20"
                    fontSize="12"
                />
            </panel>
        );
    }
}