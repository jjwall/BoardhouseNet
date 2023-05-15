import { createJSXElement } from "../../core/createjsxelement";
import { renderWidget } from "../../core/renderwidget";
import { JSXElement } from "../../core/interfaces";
import { Text } from "../../basecomponents/text";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Scene } from "three";

export function renderTitleScreenUi(scene: Scene, rootWidget: Widget, props: Props): TitleScreenRoot {
    let rootInstance = renderWidget(<TitleScreenRoot { ...props }/>, rootWidget, scene);

    return rootInstance.component as TitleScreenRoot;
}

interface Props {}

interface State {
    pressKeyOpacity: number
    pressKeyOpacityIncrease: boolean
}

export class TitleScreenRoot extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            pressKeyOpacity: 1,
            pressKeyOpacityIncrease: false
        }

        setInterval(() => {
            if (this.state.pressKeyOpacityIncrease)
                this.setState({
                    pressKeyOpacity: this.state.pressKeyOpacity += 0.01
                })
            else
                this.setState({
                    pressKeyOpacity: this.state.pressKeyOpacity -= 0.01
                })

            if (this.state.pressKeyOpacity < -0.25)
                this.setState({
                    pressKeyOpacityIncrease: true
                })

            if (this.state.pressKeyOpacity > 1.5)
                this.setState({
                    pressKeyOpacityIncrease: false
                })
        }, 12)
    }
    render(): JSXElement {
        return(
            <panel>
                <panel 
                    img="./assets/textures/logos/quest_for_the_kingmaker.png" 
                    width="750" 
                    height="550"
                    left="270"
                />
                <Text
                    top="425"
                    left="525"
                    fontSize="24"
                    contents="-Press Any Key-"
                    opacity={this.state.pressKeyOpacity}
                    shadowOffset={2}
                />
            </panel>
        )
    }
}