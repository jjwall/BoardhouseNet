import { createJSXElement } from "../../core/createjsxelement";
import { JSXElement } from "../../core/interfaces";
import { Scene, Vector3 } from "three";
import { Component } from "../../core/component";
import { DraggableWidget } from "../../basecomponents/draggablewidget";
import { InventorySlot, DropItemData } from "./inventoryslot";
import { ClientInventory } from "./rootui";
import { processItemSlotSwap } from "../utils/slotswap";

// TODO: (Done) Have items "snap" to empty inventory space if moving items around via drag and drop
// TODO: Implement Equipment Screen that enables armor and skill / weapon equips via drag and drop from inventory
// TODO: (Done) Create data or "conext" or "global state" layer that carries client item data
// -> Example: We have 8 inventory slots, client should be aware of what item is occupying which spot so
// we know what to render in the inventory on scene load. (consider on enter game and scene transition ramifications)
// TODO: Consider refactoring "data" directory at root to be named "assets". This would be a big refactor!
// TODO: Build out EquipmentSlots... could double up inventory and equipment here for simplicity's sake.
// TODO: Enable ability to hide / show Inventory via hotkey or clickable UI button on screen
// -> Vision for this was a little bag that would animate a moving animation of bag coming from off screen on bottom
// -> If we take this route, investigate UI animations (shouldn't be too hard with a little for loop async method on component)
// TODO: Create item "drops" akin to MapleStory where you have to be near it and then press "Z" or something and it 
// picks up the item and stores it in your inventory. Red warning message displays at top if inventory is full.
// -> Test cases can include current coded actions: sword, bow, magic fireball spell
// TODO: Add in goblin spawn points in forest 1-1 and have them drop items on kill. Consider drop percentages.

export interface InventorySlotMetaData {
    top: number
    left: number
    height: number
    width: number
}

interface Props {
    top: string | number
    left: string | number
    clientInventory: ClientInventory
    setClientInventory: (newClientInventory: ClientInventory) => void
}

/**
 * Todo: Test Inventory coming on / off screen.
 */
interface State {
    // top: number
    // left: number
    slotsMetadata: Array<InventorySlotMetaData>
}

/** Note: Should be top level component. Dependent on top and left attributes being absolute. */
export class Inventory extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            // Note: This could be dynamically rendered from a bag size.
            // Currently hard-coded for 8 inventory slots.
            slotsMetadata: [
                {
                    top: 5,
                    left: 5,
                    height: 64,
                    width: 64
                },
                {
                    top: 5,
                    left: 74,
                    height: 64,
                    width: 64
                },
                {
                    top: 5,
                    left: 143,
                    height: 64,
                    width: 64
                },
                {
                    top: 5,
                    left: 212,
                    height: 64,
                    width: 64
                },
                {
                    top: 74,
                    left: 5,
                    height: 64,
                    width: 64
                },
                {
                    top: 74,
                    left: 74,
                    height: 64,
                    width: 64
                },
                {
                    top: 74,
                    left: 143,
                    height: 64,
                    width: 64
                },
                {
                    top: 74,
                    left: 212,
                    height: 64,
                    width: 64
                }
            ]
        }
    }

    // Todo: fix white background "bug"
    reconcileInventory = (dropItemData: DropItemData) => {
        const newSlotIndex = processItemSlotSwap(dropItemData, this.state.slotsMetadata, Number(this.props.left), Number(this.props.top))

        if (newSlotIndex !== undefined) {
            if (newSlotIndex !== dropItemData.index) {
                if (this.props.clientInventory[newSlotIndex]) {
                    // If item exists in new slot, swap item slots. Re-render old slot index with new item.
                    this.props.clientInventory[dropItemData.index] = undefined
                    this.props.clientInventory[dropItemData.index] = this.props.clientInventory[newSlotIndex]
                } else {
                    // Else remove item from old slot index.
                    this.props.clientInventory[dropItemData.index] = undefined
                }

                // Item has been dragged to new slot. Render new slot state.
                this.props.clientInventory[newSlotIndex] = dropItemData.item
                this.props.setClientInventory(this.props.clientInventory)
            } else {
                // Item has been dragged to original slot. Re-render original slot state.
                this.props.clientInventory[newSlotIndex] = undefined
                this.props.clientInventory[newSlotIndex] = dropItemData.item
                this.props.setClientInventory(this.props.clientInventory)
            }
        } else {
            // Item has been dragged to no man's land. Re-render to original slot state.
            this.props.clientInventory[dropItemData.index] = undefined
            this.props.clientInventory[dropItemData.index] = dropItemData.item
            this.props.setClientInventory(this.props.clientInventory)
        }
    }

    render(): JSXElement {
        return (
            <panel left={this.props.left} top={this.props.top} height="143" width="281" color="#282828">
                {this.state.slotsMetadata.map((slot, index) =>
                    <InventorySlot
                        top={slot.top}
                        left={slot.left}
                        height={slot.height}
                        width={slot.width}
                        slotColor="#A9A9A9"
                        inventorySlotIndex={index}
                        reconcileInventory={this.reconcileInventory}
                        item={this.props.clientInventory[index]}
                    />
                )}
            </panel>
        )
    }
}
