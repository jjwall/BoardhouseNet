import { TouchControls } from "../../corecomponents/touchcontrols";
import { createJSXElement } from "./../../createjsxelement";
import { renderWidget } from "./../../../ui/renderwidget";
import { InputBox } from "../../corecomponents/inputbox";
import { Button } from "../../corecomponents/button";
import { JSXElement } from "./../../interfaces";
import { Component } from "./../../component";
import { Widget } from "./../../widget";
import { Scene } from "three";

export function renderGamePlayUi(scene: Scene, rootWidget: Widget, props: Props): Root {
    let rootInstance = renderWidget(<Root { ...props }/>, rootWidget, scene);

    return rootInstance.component as Root;
}


interface Props {
    // name: string;
    // initial_state: object
    addClicks: Function,
    // displayFPS: boolean;
    // leftPress: () => void;
    // leftUnpress: () => void;
    // rightPress: () => void;
    // rightUnpress: () => void;
    // upPress: () => void;
    // upUnpress: () => void;
    // downPress: () => void;
    // downUnpress: () => void;
}

interface State {
    ticks: number;
    clicks: number;
    color: string;
    hidden: boolean;
    currentFPS: number;
}

export class Root extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            currentFPS: 0,
            ticks: 50,
            clicks: 0,
            color: "#00FFFF",
            hidden: false,
        };

        setInterval(() => this.tick(), 1000);
    }

    public addClick = (): void => {
        if (!!this.props.addClicks) {
            this.props.addClicks();
        }
    }

    public setClicks = (clicks: number) => {
        this.setState({
            clicks: clicks
        });
    }

    public tick = (): void => {
        this.setState({
            ticks: this.state.ticks + 1
        });
    }

    public updateFPS = (currentFPS: number): void => {
        this.setState({
            currentFPS: currentFPS
        });
    }

    public toggle = (): void => {
        if (this.state.hidden) {
            this.setState({
                hidden: false
            });
        }
        else {
            this.setState({
                hidden: true
            });
        }
    }

    render(): JSXElement {
        return(
            <panel>
                <TouchControls
                    top="250"
                    left="50"
                    upPress={() => undefined}
                    upUnpress={() => undefined}
                    leftPress={() => undefined}
                    leftUnpress={() => undefined}
                    rightPress={() => undefined}
                    rightUnpress={() => undefined}
                    downPress={() => undefined}
                    downUnpress={() => undefined}
                />
                <Button
                    pressedLayout="./data/textures/icons/d17.png"
                    unpressedLayout="./data/textures/icons/d17.png"
                    // backgroundColor="#C9CFFF"
                    height="64"
                    width="64"
                    top="650"
                    left="1000"
                    submit={() => console.log('hello button')}
                />
            </panel>
        )
    }
}