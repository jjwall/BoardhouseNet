import { TouchControls } from "../../basecomponents/touchcontrols";
import { createJSXElement } from "./../../core/createjsxelement";
import { renderWidget } from "./../../core/renderwidget";
import { InputBox } from "../../basecomponents/inputbox";
import { Button } from "../../basecomponents/button";
import { JSXElement } from "./../../core/interfaces";
import { Component } from "../../core/component";
import { Widget } from "./../../core/widget";
import { Scene } from "three";
import { DraggableWidget } from "../../basecomponents/draggablewidget";
import { Inventory } from "./inventory";

export type ClientInventory = Array<Item | undefined>

export function renderGamePlayUi(scene: Scene, rootWidget: Widget, props: Props): Root {
    let rootInstance = renderWidget(<Root { ...props }/>, rootWidget, scene);

    return rootInstance.component as Root;
}

export interface Item {
    // type: string
    // stats: number
    layout: string
    onDragLayout: string
}

export interface GlobalState {
    clientInventory: Array<Item | undefined>
    //ClientInventory
}

export const mockGlobalState: GlobalState = {
    clientInventory: [
        {
            layout: "./data/textures/icons/d17.png",
            onDragLayout: "./data/textures/icons/d49.png"
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    ]
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
    clientInventory: ClientInventory
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
            clientInventory: mockGlobalState.clientInventory
        };

        setInterval(() => this.tick(), 1000);
    }

    setClientInventory = (newClientInventory: ClientInventory) => {
        this.setState({
            clientInventory: newClientInventory
        })
        console.log(this.state.clientInventory)
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
                <Inventory
                    top="550"
                    left="975"
                    clientInventory={this.state.clientInventory}
                    setClientInventory={this.setClientInventory}
                />
            </panel>
        )
    }
}