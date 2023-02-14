// An attempt to solve for the equip swap validation bug. This code is rubbish and needs desparate simplification.

// export const reconcileInventory = (dropItemData: DropItemData) => 
//     const newSlotIndex = processItemSlotSwap(dropItemData, this.state.slotsMetadata, Number(this.props.left), Number(this.props.top))
//     let validEquipSwap = false

//     if (newSlotIndex !== null) {
//         if (newSlotIndex !== dropItemData.index) {
//             if (this.props.clientInventory[newSlotIndex]) {
//                 // If item exists in new slot, swap item slots. Re-render old slot index with new item.

//                 // if (this.validateItemEquip(dropItemData, newSlotIndex)) { 
//                 // }
//                 if (dropItemData.index >= this.maxInventorySlots) {
//                     console.log('hello??')
//                     if (this.validateItemEquip(dropItemData, newSlotIndex)) {
//                         // Client is dragging an equipped item into occupied inventory slot.
//                         // Since this equip event is valid, swap item slots & re-render old slot index with new item.
//                         this.props.clientInventory[dropItemData.index] = null
//                         this.props.clientInventory[dropItemData.index] = this.props.clientInventory[newSlotIndex]
//                         // validEquipSwap = true
//                         // this.props.clientInventory[newSlotIndex] = null
//                         // this.props.clientInventory[newSlotIndex] = dropItemData.item
//                         // this.props.setClientInventory(this.props.clientInventory)
//                     } else {
//                         // Notify client that this item cannot be equipped here.
//                         const notificationData: NotificationData = {
//                             clientId: 'test', // get this from somewhere...
//                             notification: "This item cannot be equipped here...",
//                             color: "#FF0000",
//                             milliseconds: 3500
//                         }
//                         this.props.setNotificationMessage(notificationData)

//                         // Re-render items to their original slot states.
//                         // this.props.clientInventory[newSlotIndex] = null
//                         // this.props.clientInventory[newSlotIndex] = this.props.clientInventory[newSlotIndex]
//                         // this.props.clientInventory[dropItemData.index] = null
//                         // this.props.clientInventory[dropItemData.index] = dropItemData.item
//                         // this.props.setClientInventory(this.props.clientInventory)
//                         // this.props.clientInventory[newSlotIndex] = null
//                         // this.props.clientInventory[newSlotIndex] = dropItemData.item
//                         // this.props.clientInventory[dropItemData.index] = null
//                         // this.props.clientInventory[dropItemData.index] = this.props.clientInventory[newSlotIndex]
//                         // this.props.setClientInventory(this.props.clientInventory)
//                     }
//                 } else {
//                     // If item exists in new slot, swap item slots. Re-render old slot index with new item.
//                     this.props.clientInventory[dropItemData.index] = null
//                     this.props.clientInventory[dropItemData.index] = this.props.clientInventory[newSlotIndex]
//                 }
//             } else {
//                 // Else remove item from old slot index.
//                 this.props.clientInventory[dropItemData.index] = null
//             }

//             // console.log(dropItemData.index)

//             if (newSlotIndex >= this.maxInventorySlots) {
//                 // Item attempting to be equipped. Check if item can be equipped.
//                 if (this.validateItemEquip(dropItemData, newSlotIndex)) {
//                     // Item successfully equipped in designated slot.
//                     this.props.clientInventory[newSlotIndex] = dropItemData.item
//                     this.props.setClientInventory(this.props.clientInventory)
//                 } else {
//                     // Notify client that this item cannot be equipped here.
//                     const notificationData: NotificationData = {
//                         clientId: 'test', // get this from somewhere...
//                         notification: "This item cannot be equipped here...",
//                         color: "#FF0000",
//                         milliseconds: 3500
//                     }
//                     this.props.setNotificationMessage(notificationData)

//                     // Re-render item to original slot state.
//                     this.props.clientInventory[dropItemData.index] = null
//                     this.props.clientInventory[dropItemData.index] = dropItemData.item
//                     this.props.setClientInventory(this.props.clientInventory)
//                 }
//             } else {
//                 // Item has been dragged to new invetory slot. Render new slot state.
//                 // Client is just rearanging inventory here, no events need to be sent to server.
//                 if (validEquipSwap) {
//                     this.props.clientInventory[newSlotIndex] = dropItemData.item
//                     this.props.setClientInventory(this.props.clientInventory)
//                 }
//             }
//         } else {
//             // Item has been dragged to original slot. Re-render original slot state.
//             this.props.clientInventory[newSlotIndex] = null
//             this.props.clientInventory[newSlotIndex] = dropItemData.item
//             this.props.setClientInventory(this.props.clientInventory)
//         }
//     } else {
//         // Item has been dragged to no man's land. Re-render to original slot state.
//         this.props.clientInventory[dropItemData.index] = null
//         this.props.clientInventory[dropItemData.index] = dropItemData.item
//         this.props.setClientInventory(this.props.clientInventory)
//     }
// }