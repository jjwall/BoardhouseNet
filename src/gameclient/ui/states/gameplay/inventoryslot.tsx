import { DraggableWidget } from "../../basecomponents/draggablewidget";
import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Item } from "./rootui";
import { Scene } from "three";

export interface DropItemData {
    index: number
    worldPosX: number
    worldPosY: number
    height: number
    width: number
    // item
}

interface Props {
    top: string | number
    left: string | number
    height: string | number
    width: string | number
    slotColor: string
    item: Item | undefined
    inventorySlotIndex: number
    reconcileInventory: (slotData: DropItemData) => void
}

interface State {
    item: Item | undefined
}

// Note: ItemSlot might be a better name.
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
            worldPosY: worldPosY,
            height: Number(this.props.height),
            width: Number(this.props.width)
        })
    }

    render(): JSXElement {
        if (!this.props.item) {
            return (
                <panel left={this.props.left} top={this.props.top} height={this.props.height} width={this.props.width} color={this.props.slotColor}></panel>
            )
        } else {
            return (
                <panel left={this.props.left} top={this.props.top} height={this.props.height} width={this.props.width} color={this.props.slotColor}>
                    <DraggableWidget
                        onDragEnd={this.onItemDrop}
                        pressedLayout={this.props.item.onDragLayout}
                        unpressedLayout={this.props.item.layout}
                        height={this.props.height}
                        width={this.props.width}
                        top={0}
                        left={0}
                    />
                </panel>
            )
        }
    }
}
