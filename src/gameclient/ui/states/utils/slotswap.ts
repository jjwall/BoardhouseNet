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

// type CollidableEntity = {
//     hitbox: Hitbox
// }

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
    // const globalPos = getWorldPosition(e);

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

export function checkSlotSwap(item: DropItemData, slotsMetaData: InventorySlotMetaData[], offsetX: number, offsetY: number) {
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
                console.log('collided with slot index: ' + index)
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
        onHit: () => {
            console.log('collided w item?')
        }
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

    const allBodies = slots
        // .filter(e => e.hitbox)
        .map((e): Body => ({ ent: e, rect: getHitbox(e) }));

    allBodies.push({ent: collidableItem, rect: getHitbox(collidableItem)})

    allBodies.sort((a, b) => a.rect.left - b.rect.left);

    let bodyWindow = [] as Body[];

    for (const body of allBodies) {
        bodyWindow = bodyWindow.filter(otherBody => body.rect.left <= otherBody.rect.right);

        for (const otherBody of bodyWindow) {
            const manifold = getManifold(body.rect, otherBody.rect);
            // const manifold = getManifold(collidableItem., body.rect);
            // console.log(manifold)

            if (manifold.width > 0 && manifold.height > 0) {
                // console.log('hit');
                tryOnHit(body.ent, otherBody.ent, manifold);
                tryOnHit(otherBody.ent, body.ent, manifold);
                // tryOnHit(collidableItem, body.ent, manifold)
                // tryOnHit(otherBody.ent, collidableItem, manifold)
            }
        }

        bodyWindow.push(body);
    }
}