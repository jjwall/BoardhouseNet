import { createJSXElement } from "../../core/createjsxelement";
import { ItemData } from "../../../../packets/data/itemdata";
import { renderWidget } from "../../core/renderwidget";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Inventory } from "./inventory";
import { Scene } from "three";

export type ClientInventory = Array<ItemData | undefined>

export function renderGamePlayUi(scene: Scene, rootWidget: Widget, props: Props): Root {
    let rootInstance = renderWidget(<Root { ...props }/>, rootWidget, scene);

    return rootInstance.component as Root;
}


interface Props {
    initialState: GlobalState
}

interface GlobalState {
    clientInventory: ClientInventory
}

export class Root extends Component<Props, GlobalState> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            clientInventory: props.initialState.clientInventory
        };
    }

    getState() {
        return this.state
    }

    setClientInventory = (newClientInventory: ClientInventory) => {
        this.setState({
            clientInventory: newClientInventory
        })
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