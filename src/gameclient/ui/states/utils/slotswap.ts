import { InventorySlotMetaData } from "../gameplay/inventory";
import { DropItemData } from "../gameplay/inventoryslot";

type Rect = {
    left: number;
    right: number;
    bottom: number;
    top: number;
};

type Manifold = Rect & {
    width: number;
    height: number;
};

interface ManifoldData {
    manifoldArea: number
    manifold: Manifold
    body: CollidableEntity
    otherBody: CollidableEntity
}

interface CollidableEntity {
    height: number;
    width: number;
    worldPosX: number;
    worldPosY: number;
    offsetX: number;
    offsetY: number;
    onHit?: (self: CollidableEntity, other: CollidableEntity, manifold: Manifold) => void;
}

const getHitbox = (e: CollidableEntity): Rect => {
    return {
        left: e.worldPosX + e.offsetX - e.width / 2,
        right: e.worldPosX + e.offsetX + e.width / 2,
        bottom: e.worldPosY + e.offsetY - e.height / 2,
        top: e.worldPosY + e.offsetY + e.height / 2,
    }
};

const getManifold = (a: Rect, b: Rect): Manifold => {
    const rect = {
        left: Math.max(a.left, b.left),
        right: Math.min(a.right, b.right),
        bottom: Math.max(a.bottom, b.bottom),
        top: Math.min(a.top, b.top),
    };

    return {
        ...rect,
        width: rect.right - rect.left,
        height: rect.top - rect.bottom,
    };
};

/**
 * Detects which item slot the current drag and dropped item is colliding with.
 * @param item Current dropped item.
 * @param slotsMetaData 
 * @param offsetX 
 * @param offsetY 
 * @returns The slot index based on the item collision detection. Can be undefined. 
 */
export function processItemSlotSwap(item: DropItemData, slotsMetaData: InventorySlotMetaData[], offsetX: number, offsetY: number): number {
    let newSlotIndex: number = undefined
    let slots: CollidableEntity[] = []

    slotsMetaData.forEach((slot, index) => {
        slots.push({
            height: item.height,
            width: item.width,
            worldPosX: slot.left,
            worldPosY: slot.top,
            offsetX: offsetX,
            offsetY: offsetY,
            onHit: () => {
                newSlotIndex = index
            }
        })
    })

    const collidableItem: CollidableEntity = {
        height: item.height,
        width: item.width,
        worldPosX: item.worldPosX,
        worldPosY: -item.worldPosY,
        offsetX: 0,
        offsetY: 0,
    }

    type Body = {
        ent: CollidableEntity;
        rect: Rect;
    };

    const tryOnHit = (a: CollidableEntity, b: CollidableEntity, m: Manifold) => {
        if (a.onHit) {
            a.onHit(a, b, m);
        }
    };

    const allBodies = slots.map((e): Body => ({ ent: e, rect: getHitbox(e) }));

    allBodies.push({ent: collidableItem, rect: getHitbox(collidableItem)})

    allBodies.sort((a, b) => a.rect.left - b.rect.left);

    let bodyWindow = [] as Body[];

    const manifoldData: ManifoldData[] = []

    for (const body of allBodies) {
        bodyWindow = bodyWindow.filter(otherBody => body.rect.left <= otherBody.rect.right);

        for (const otherBody of bodyWindow) {
            const manifold = getManifold(body.rect, otherBody.rect);

            if (manifold.width > 0 && manifold.height > 0) {
                manifoldData.push({
                    manifoldArea: manifold.height * manifold.width,
                    manifold: manifold,
                    body: body.ent,
                    otherBody: otherBody.ent,
                })
            }
        }

        bodyWindow.push(body);
    }

    if (manifoldData.length > 0) {
        const largestManifold = manifoldData.reduce((a, b) => a.manifoldArea > b.manifoldArea ? a:b)
        tryOnHit(largestManifold.body, largestManifold.otherBody, largestManifold.manifold);
        tryOnHit(largestManifold.otherBody, largestManifold.body, largestManifold.manifold);
    }

    return newSlotIndex
}
