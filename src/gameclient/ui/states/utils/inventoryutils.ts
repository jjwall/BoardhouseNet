export interface InventorySlotMetaData {
    top: number
    left: number
    height: number
    width: number
}

/**
 * Equipment slot top offset distance from inventory slots. 
 */
const equipmentTopOffset = 94

/**
 * Render data for inventory slots.
 * Note: This could be dynamically rendered from a bag size.
 * Currently hard-coded for 8 inventory slots.
 */
export const inventorySlotsMetaData: Array<InventorySlotMetaData> = [
    // Inventory slots.
    {
        top: 5 + equipmentTopOffset,
        left: 5,
        height: 64,
        width: 64
    },
    {
        top: 5 + equipmentTopOffset,
        left: 74,
        height: 64,
        width: 64
    },
    {
        top: 5 + equipmentTopOffset,
        left: 143,
        height: 64,
        width: 64
    },
    {
        top: 5 + equipmentTopOffset,
        left: 212,
        height: 64,
        width: 64
    },
    {
        top: 74 + equipmentTopOffset,
        left: 5,
        height: 64,
        width: 64
    },
    {
        top: 74 + equipmentTopOffset,
        left: 74,
        height: 64,
        width: 64
    },
    {
        top: 74 + equipmentTopOffset,
        left: 143,
        height: 64,
        width: 64
    },
    {
        top: 74 + equipmentTopOffset,
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
