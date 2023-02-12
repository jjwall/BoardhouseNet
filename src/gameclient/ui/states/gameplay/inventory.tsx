import { NotificationData } from "../../../../packets/data/notificationdata";
import { createJSXElement } from "../../core/createjsxelement";
import { InventorySlot, DropItemData } from "./inventoryslot";
import { processItemSlotSwap } from "../utils/slotswap";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { ClientInventory } from "./rootui";
import { Scene } from "three";

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
// -> Can use new "undraggable" attr to pause draggability while animation is playing out.
// TODO: Create item "drops" akin to MapleStory where you have to be near it and then press "Z" or something and it 
// picks up the item and stores it in your inventory. Red warning message displays at top if inventory is full.
// -> Test cases can include current coded actions: sword, bow, magic fireball spell
// TODO: Add in goblin spawn points in forest 1-1 and have them drop items on kill. Consider drop percentages.
// Consolidated Todo's: account for client / server side inventory sync. Set up equipment slots and enable skill equips.
// TODO: Context / hover menu for viewing item stats. More elaborate itemData fields.
// TODO: Build out item presets for random pull bag drops.
// TODO: Implement item dropping mechanic
// -> Since dragging an item off the inventory may be too common an action with equips, we might implement a "trashcan" icon
// near the inventory widget that would trigger a "drop" -> item should be randomly popped out in an area field near the dropping player.
// This way if a player was to drop a bunch of items all at once they likely wouldn't stack on each other. OR
// --> Better idea: When items hitboxes touch each other they push each other out - like how goblins do with one another.

// TODO: Fire UI Events to Client to send to server for ui related events

export interface InventorySlotMetaData {
    top: number
    left: number
    height: number
    width: number
}

interface Props {
    top: string | number
    left: string | number
    color: string
    opacity: string | number
    clientInventory: ClientInventory
    setClientInventory: (newClientInventory: ClientInventory) => void
    setNotificationMessage: (newNotificationMessage: NotificationData) => void
}

/**
 * Todo: Test Inventory coming on / off screen.
 */
interface State {
    top: string | number
    draggingDisabled: boolean
    slotsMetadata: Array<InventorySlotMetaData>
}

/** Note: Should be top level component. Dependent on top and left attributes being absolute. */
export class Inventory extends Component<Props, State> {
    maxEquipmentSlots = 4
    maxInventorySlots = 8
    equipmentTopOffset = 94
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            top: this.props.top,
            draggingDisabled: false,
            // Note: This could be dynamically rendered from a bag size.
            // Currently hard-coded for 8 inventory slots.
            slotsMetadata: [
                // Inventory slots.
                {
                    top: 5 + this.equipmentTopOffset,
                    left: 5,
                    height: 64,
                    width: 64
                },
                {
                    top: 5 + this.equipmentTopOffset,
                    left: 74,
                    height: 64,
                    width: 64
                },
                {
                    top: 5 + this.equipmentTopOffset,
                    left: 143,
                    height: 64,
                    width: 64
                },
                {
                    top: 5 + this.equipmentTopOffset,
                    left: 212,
                    height: 64,
                    width: 64
                },
                {
                    top: 74 + this.equipmentTopOffset,
                    left: 5,
                    height: 64,
                    width: 64
                },
                {
                    top: 74 + this.equipmentTopOffset,
                    left: 74,
                    height: 64,
                    width: 64
                },
                {
                    top: 74 + this.equipmentTopOffset,
                    left: 143,
                    height: 64,
                    width: 64
                },
                {
                    top: 74 + this.equipmentTopOffset,
                    left: 212,
                    height: 64,
                    width: 64
                },
                // Equipment slots.
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
            ]
        }

        // setInterval(() => this.animate(), 50);
    }

    // TODO: Work on animating open / close inventory.
    animate = () => {
        this.setState({
            top: Number(this.state.top) - 5
        })
    }

    /**
     * Checks if current item can be equipped in designated equipment slot.
     * @param dropItemData 
     * @returns true if item can be equipped, false if it cannot
     */
    validateItemEquip = (dropItemData: DropItemData, equipmentSlot: number): boolean => {
        // TODO: Validation on item types here and equipment slot.
        // equipmentSlot 10 -> primary weapon
        // equipmentSlot 11 -> secondary weapon
        // equipmentSlot 12 -> armor
        // equipmentSlot 13 -> accessory
        // TODO: Notify server of new equip (will need to do back end work of swapping skill slot etc. etc.)
        let validEquip = true
        return validEquip
    }

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

                if (newSlotIndex >= this.maxInventorySlots) {
                    // Item attempting to be equipped. Check if item can be equipped.
                    if (this.validateItemEquip(dropItemData, newSlotIndex)) {
                        // Item successfully equipped in designated slot.
                        this.props.clientInventory[newSlotIndex] = dropItemData.item
                        this.props.setClientInventory(this.props.clientInventory)
                    } else {
                        // Notify client that this item cannot be equipped here.
                        const notificationData: NotificationData = {
                            clientId: 'test', // get this from somewhere...
                            notification: "This item cannot be equipped here...",
                            color: "#FF0000",
                            milliseconds: 3500
                        }
                        this.props.setNotificationMessage(notificationData)

                        // Re-render item to original slot state.
                        this.props.clientInventory[dropItemData.index] = undefined
                        this.props.clientInventory[dropItemData.index] = dropItemData.item
                        this.props.setClientInventory(this.props.clientInventory)
                    }
                } else {
                    // Item has been dragged to new invetory slot. Render new slot state.
                    // Client is just rearanging inventory here, no events need to be sent to server.
                    this.props.clientInventory[newSlotIndex] = dropItemData.item
                    this.props.setClientInventory(this.props.clientInventory)
                }
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
            <panel left={this.props.left} top={this.state.top} height="237" width="281" color={this.props.color} opacity={this.props.opacity}>
                {this.state.slotsMetadata.map((slot, index) =>
                    <InventorySlot
                        top={slot.top}
                        left={slot.left}
                        height={slot.height}
                        width={slot.width}
                        slotColor="#A9A9A9"
                        opacity={this.props.opacity}
                        inventorySlotIndex={index}
                        reconcileInventory={this.reconcileInventory}
                        item={this.props.clientInventory[index]}
                        draggingDisabled={this.state.draggingDisabled}
                    />
                )}
            </panel>
        )
    }
}
