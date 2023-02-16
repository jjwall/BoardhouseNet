import { createJSXElement } from "../../core/createjsxelement";
import { ProgressBar } from "../../basecomponents/progressbar";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Scene } from "THREE";

interface Props {
    top?: string | number;
    left?: string | number;
    // setHUDState
}

interface State {
}

export class HUD extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
        }
    }

    render(): JSXElement {
        return (
            <panel top={this.props.top} left={this.props.left} height={500} width={500}>
                <ProgressBar
                    top={15}
                    left={15}
                    baseWidth={200}
                    baseHeight={10}
                    maxUnits={1000}
                    currentUnits={1000}
                    barColor="#c9424a" //"#cf4e55"
                />
                <ProgressBar
                    top={30}
                    left={15}
                    baseWidth={200}
                    baseHeight={10}
                    maxUnits={1000}
                    currentUnits={1000}
                    barColor="#1baac1"
                />
                <ProgressBar
                    top={45}
                    left={15}
                    baseWidth={200}
                    baseHeight={10}
                    maxUnits={1000}
                    currentUnits={1000}
                    barColor="#23b14d"
                />
                <label top={75} left={34} font_size={12} contents="Lv: 1"></label>
                <label top={74} left={35} font_size={12} color="#FFFFFF" contents="Lv: 1"></label>
            </panel>
        );
    }
}