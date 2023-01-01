import { createJSXElement } from "./../../core/createjsxelement";
import { JSXElement } from "./../../core/interfaces";
import { Scene, Vector3 } from "three";
import { Component } from "../../core/component";
import { DraggableWidget } from "../../corecomponents/draggablewidget";
import { ClientInventory, Item } from "./rootui";

export interface InventorySlotData {
    index: number
    worldPosX: number
    worldPosY: number
    // item
}

interface Props {
    top: string | number
    left: string | number
    item: Item | undefined
    inventorySlotIndex: number
    reconcileInventory: (slotData: InventorySlotData) => void
    // clientInventory: ClientInventory
    // onItemDrop: (itemSlotSetState: () => void) => void
}

interface State {
    item: Item | undefined
}

export class InventorySlot extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            item: this.props.item
        }
    }

    onItemDrop = (worldPosX: number, worldPosY: number) => {
        this.props.reconcileInventory({
            index: this.props.inventorySlotIndex,
            worldPosX: worldPosX,
            worldPosY: worldPosY
        })
    }

    render(): JSXElement {
        if (!this.props.item) {
            return (
                <panel left={this.props.left} top={this.props.top} height="64" width="64" color="#A9A9A9"></panel>
            )
        } else {
            return (
                <panel left={this.props.left} top={this.props.top} height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        onDragEnd={this.onItemDrop}
                        pressedLayout={this.props.item.onDragLayout}
                        unpressedLayout={this.props.item.layout}
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
            )
        }
    }
}
