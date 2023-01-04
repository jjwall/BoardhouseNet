import { DraggableWidget } from "../../basecomponents/draggablewidget";
import { createJSXElement } from "../../core/createjsxelement";
import { ItemData } from "../../../../packets/data/itemdata";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Scene } from "three";

export interface DropItemData {
    index: number
    worldPosX: number
    worldPosY: number
    height: number
    width: number
    item: ItemData | undefined
}

interface Props {
    top: string | number
    left: string | number
    height: string | number
    width: string | number
    slotColor: string
    opacity: string | number
    item: ItemData | undefined
    inventorySlotIndex: number
    reconcileInventory: (slotData: DropItemData) => void
}

interface State {
    item: ItemData | undefined
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
            width: Number(this.props.width),
            item: this.props.item
        })
    }

    /** 
     * This workaround fixes the "white background" bug. Necessary since I believe
     * layoutwidget doesn't disemble old components effectively.
     */
    renderVacantItemSlot = () => (
        <DraggableWidget
            onDragEnd={() => undefined}
            pressedLayout={undefined}
            unpressedLayout={undefined}
            height={this.props.height}
            width={this.props.width}
            top={0}
            left={0}
            undraggable={true}
        />
    )

    renderOccupiedItemSlot = () => (
        <DraggableWidget
            onDragEnd={this.onItemDrop}
            pressedLayout={this.props.item.onDragSpriteUrl}
            unpressedLayout={this.props.item.spriteUrl}
            height={this.props.height}
            width={this.props.width}
            top={0}
            left={0}
        />
    )

    render(): JSXElement {
        if (!this.props.item)
            return (
                <panel left={this.props.left} top={this.props.top} height={this.props.height} width={this.props.width} color={this.props.slotColor} opacity={this.props.opacity}>
                    {this.renderVacantItemSlot()}
                </panel>
            )
        else
            return (
                <panel left={this.props.left} top={this.props.top} height={this.props.height} width={this.props.width} color={this.props.slotColor} opacity={this.props.opacity}>
                    {this.renderOccupiedItemSlot()}
                </panel>
            )
    }
}
