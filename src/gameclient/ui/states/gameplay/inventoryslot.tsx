import { DraggableWidget } from "../../basecomponents/draggablewidget";
import { createJSXElement } from "../../core/createjsxelement";
import { ItemData } from "../../../../packets/data/itemdata";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Scene } from "three";

export interface DraggedItemData {
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
    draggingDisabled: boolean
    reconcileInventory: (slotData: DraggedItemData) => void
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
            disabled={true}
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
            disabled={this.props.draggingDisabled}
        />
    )

    renderEquipmentSlotIcon = (slotOccupied: boolean) => {
        const equipSlotImgUrl = (imgUrl: string) => slotOccupied ? undefined : imgUrl

        switch (this.props.inventorySlotIndex) {
            case 8: // Sword Inventory Icon.
                return (<panel img={equipSlotImgUrl("./data/textures/icons/sword_inventory_icon.png")} pixel-ratio={4}></panel>)
            case 9: // Shield Inventory Icon.
                return (<panel img={equipSlotImgUrl("./data/textures/icons/shield_inventory_icon.png")} pixel-ratio={4}></panel>)
            case 10: // Armor Inventory Icon.
                return (<panel img={equipSlotImgUrl("./data/textures/icons/armor_inventory_icon.png")} pixel-ratio={4}></panel>)
            case 11: // Accessory Inventory Icon.
                return (<panel img={equipSlotImgUrl("./data/textures/icons/accessory_inventory_icon.png")} pixel-ratio={4}></panel>)
            default: // Render empty panel element.
                return (<panel></panel>)
        }
    }

    render(): JSXElement {
        if (!this.props.item)
            return (
                <panel left={this.props.left} top={this.props.top} height={this.props.height} width={this.props.width} color={this.props.slotColor} opacity={this.props.opacity}>
                    {this.renderEquipmentSlotIcon(false)}
                    {this.renderVacantItemSlot()}
                </panel>
            )
        else
            return (
                <panel left={this.props.left} top={this.props.top} height={this.props.height} width={this.props.width} color={this.props.slotColor} opacity={this.props.opacity}>
                    {this.renderEquipmentSlotIcon(true)}
                    {this.renderOccupiedItemSlot()}
                </panel>
            )
    }
}
