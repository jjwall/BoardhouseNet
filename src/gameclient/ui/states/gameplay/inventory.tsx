import { InventorySlotMetaData, inventorySlotsMetaData, processItemSlotSwap } from "../utils/inventoryutils";
import { NotificationData } from "../../../../packets/data/notificationdata";
import { UIEventTypes } from "../../../../packets/enums/uieventtypes";
import { InventorySlot, DraggedItemData } from "./inventoryslot";
import { createJSXElement } from "../../core/createjsxelement";
import { ClientInventory, UIEvents } from "./rootui";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Scene } from "three";

// TODO: (Done) Implement Equipment Screen that enables armor and skill / weapon equips via drag and drop from inventory
// -> Implement skill equips / item types / equip validation / more detailed item data.
// TODO: (Done) Create data or "conext" or "global state" layer that carries client item data
// -> Example: We have 8 inventory slots, client should be aware of what item is occupying which spot so
// we know what to render in the inventory on scene load. (consider on enter game and scene transition ramifications)
// TODO: Consider refactoring "data" directory at root to be named "assets". This would be a big refactor!
// TODO: (Done) Build out EquipmentSlots... could double up inventory and equipment here for simplicity's sake.
// TODO: Create item "drops" akin to MapleStory where you have to be near it and then press "V" or something and it 
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

// TODO: (Done) Fire UI Events to Client to send to server for ui related events
// TODO: Bug -> Swapping item with equip slot doesn't trigger inventory event...

interface Props {
    top: string | number
    left: string | number
    color: string
    opacity: string | number
    draggingDisabled: boolean
    clientInventory: ClientInventory
    setUIEvents: (newUIEvents: UIEvents) => void
    setClientInventory: (newClientInventory: ClientInventory) => void
    setNotificationMessage: (newNotificationMessage: NotificationData) => void
}

/**
 * Todo: Test Inventory coming on / off screen.
 */
interface State {
    top: string | number // technically don't need anymore
    slotsMetadata: Array<InventorySlotMetaData>
}

/** Note: Should be top level component. Dependent on top and left attributes being absolute. */
export class Inventory extends Component<Props, State> {
    maxEquipmentSlots = 4
    maxInventorySlots = 8
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            top: this.props.top,
            slotsMetadata: inventorySlotsMetaData
        }
    }

    /**
     * Checks if current item can be equipped in designated equipment slot.
     * @param pendingEquipItemData 
     * @returns true if item can be equipped, false if it cannot
     */
    validateItemEquip = (pendingEquipItemData: DraggedItemData, equipmentSlot: number): boolean => {
        // TODO: Validation on item types here and equipment slot.
        // equipmentSlot 10 -> primary weapon
        // equipmentSlot 11 -> secondary weapon
        // equipmentSlot 12 -> armor
        // equipmentSlot 13 -> accessory
        // TODO: Notify server of new equip (will need to do back end work of swapping skill slot etc. etc.)
        let validEquip = true

        if (validEquip) {
            this.props.setUIEvents([UIEventTypes.ITEM_EQUIP_EVENT])
        }
        return validEquip
    }

    /**
     * Reconciles inventory and send equip events for any un/equips that happen.
     * TODO (maybe): Think one more POSSIBLE edge case to be solved for... swapping equipment slots...
     * -> Since dragEquippedItemToOccupiedInventorySlot only handles equip <-> inventory.
     * @param draggedItemData 
     */
    reconcileInventory = (draggedItemData: DraggedItemData) => {
        const newSlotIndex = processItemSlotSwap(draggedItemData, this.state.slotsMetadata, Number(this.props.left), Number(this.props.top))
        const draggedItemIsBeingEquipped = newSlotIndex >= this.maxInventorySlots
        const oldSlotWasAnEquipmentSlot = draggedItemData.index >= this.maxInventorySlots
        const draggedItemIsBeingMovedToInventorySlot = newSlotIndex < this.maxInventorySlots

        const dragItemToEquipSlot = () => {
            // Item attempting to be equipped. Check if item can be equipped.
            if (this.validateItemEquip(draggedItemData, newSlotIndex)) {
                // Item successfully equipped in designated slot.
                this.props.clientInventory[newSlotIndex] = draggedItemData.item
            } else {
                // Notify client that this item cannot be equipped here.
                const notificationData: NotificationData = {
                    clientId: 'test', // get this from somewhere...
                    notification: "This item cannot be equipped here...",
                    color: "#FF0000",
                    milliseconds: 3500
                }
                this.props.setNotificationMessage(notificationData)

                // Set item in original slot state.
                this.props.clientInventory[draggedItemData.index] = draggedItemData.item
            }
        }

        const dragItemToNewSlot = () => {
            // If item exists in new slot, swap item slots. Otherwise, old slot will be set to null.
            this.props.clientInventory[draggedItemData.index] = this.props.clientInventory[newSlotIndex]

            if (draggedItemIsBeingEquipped) {
                dragItemToEquipSlot()
            } else {
                // Item has been dragged to new invetory slot. Render new slot state.
                // Client is just rearanging inventory here, no events need to be sent to server.
                this.props.clientInventory[newSlotIndex] = draggedItemData.item
            }

            // An item is being unequipped and possibly equipped at the same time.
            if (oldSlotWasAnEquipmentSlot && draggedItemIsBeingMovedToInventorySlot) {
                if (this.props.clientInventory[draggedItemData.index]) {
                    // Handle unequip and equip swap edge case.
                    dragEquippedItemToOccupiedInventorySlot()
                } else {
                    // A regular unequip event occurs.
                    this.props.setUIEvents([UIEventTypes.ITEM_EQUIP_EVENT])
                }
            }
        }

        const dragEquippedItemToOccupiedInventorySlot = () => {
            // Client dragged an equipped item into occupied inventory slot.
            // If this was a valid inventory event, trigger equip event, else undo inventory event.
            if (!this.validateItemEquip(draggedItemData, newSlotIndex)) {
                // Notify client that this item cannot be equipped here.
                const notificationData: NotificationData = {
                    clientId: 'test', // get this from somewhere...
                    notification: "This item cannot be equipped here...",
                    color: "#FF0000",
                    milliseconds: 3500
                }
                this.props.setNotificationMessage(notificationData)

                // Set items in their original slot states.
                this.props.clientInventory[newSlotIndex] = this.props.clientInventory[draggedItemData.index]
                this.props.clientInventory[draggedItemData.index] = draggedItemData.item
            }

        }

        if (newSlotIndex === null) {
            // Item has been dragged to no man's land. Re-render to original slot state.
            // Todo: Render item drop prompt.
            this.props.clientInventory[draggedItemData.index] = draggedItemData.item
        } else if (newSlotIndex === draggedItemData.index) {
            // Item has been dragged to original slot. Re-render original slot state.
            this.props.clientInventory[newSlotIndex] = draggedItemData.item
        } else {
            dragItemToNewSlot()
        }

        // Update client inventory state with slot changes.
        this.props.setClientInventory(this.props.clientInventory)
    }

    render(): JSXElement {
        return (
            <panel left={this.props.left} top={this.props.top} height="237" width="281" color={this.props.color} opacity={this.props.opacity}>
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
                        draggingDisabled={this.props.draggingDisabled}
                    />
                )}
            </panel>
        )
    }
}
