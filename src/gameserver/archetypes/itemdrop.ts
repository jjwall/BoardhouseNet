import { broadcastPlayerItemPickupMessage, sendPlayerNotificationMessage } from "../messaging/sendnetworldmessages";
import { itemPickupArrowAnim } from "../../modules/animations/animationdata/itempickuparrow";
import { broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { PositionComponent, setPosition } from "../components/position";
import { NotificationData } from "../../packets/data/notificationdata";
import { ItemPickupData } from "../../packets/data/itempickupdata";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setHitbox, HitboxTypes } from "../components/hitbox";
import { ItemData } from "../../packets/data/itemdata";
import { setAnim } from "../components/animation";
import { setSprite } from "../components/sprite";
import { Entity } from "../serverengine/entity";

// Todo: Create more granular pickup mechanics, not just running into the item.
// -> Require client to hit ctrl key or something when hitbox is near item.
// --> This will cause a client -> server ping which can give us an opportunity to
// -- pass the client inventory data to server which we can test / reconcile server inventory against.
// Todo: (Done-ish) Establish a server side "inventory" component on player component
// -> This can be passed up on item pick up (net message) or item drop (client message)
// Todo: (Done) Implement player pick up item on client side.
// Todo ?: Sync client inventory w/ server inventory. "Order" events don't need to be
// -> maybe just have a sort event send on every move?
// sent for every increment. But item "events" should check client set with server set
// to negate hacking tactics. In this case order could be assessed for server side.
// ChatGPT Recommendations to sort client and server inventory lists to check against.
// -> When adding an item, add to server list, send added item to client (as we currently do)
// -> when dropping an item, send entire client inventory with dropping item back to server?
export function createItemDrop(worldEngine: BaseWorldEngine, pos: PositionComponent, item: ItemData): Entity {
    let itemDrop = new Entity();
    itemDrop.pos = pos;
    itemDrop.sprite = setSprite(item.spriteUrl)
    itemDrop.hitbox = setHitbox(HitboxTypes.ITEM_DROP, [HitboxTypes.PLAYER], 50, 50);

    let itemPickupArrow = new Entity();
    itemPickupArrow.pos = setPosition(0, 64, 3);
    itemPickupArrow.sprite = setSprite("./assets/textures/vfx/item_pickup_arrow001.png", 4)
    itemPickupArrow.anim = setAnim(itemPickupArrowAnim)
    itemPickupArrow.parent = itemDrop

    // Todo: put this in new events dir? like playerpicksupitemevent...
    itemDrop.hitbox.onHit = (self, other, manifold) => {
        if (other.player) {
            // If there's space in the inventory, add the item to it.
            if (other.player.inventory.includes(null)) {
                // Find first available item slot index and add item to server side inventory.
                const emptyItemSlotIndex = other.player.inventory.indexOf(null)

                // Make sure item slot index is less than max inventory size, otherwise we'll be looking at equipment slots.
                if (emptyItemSlotIndex < 8) {
                    other.player.inventory[emptyItemSlotIndex] = item

                    // Remove item drop from world.
                    broadcastDestroyEntitiesMessage(
                        [itemDrop, itemPickupArrow], 
                        worldEngine.server, 
                        worldEngine
                    );
    
                    // Broadcast to all client that a player successfully picked up an item.
                    const itemPickupData: ItemPickupData = {
                        pickupClientId: other.player.id,
                        item: item,
                    }
                    broadcastPlayerItemPickupMessage(worldEngine.server, itemPickupData)
                } else {
                    // Send player inventory is full notification.
                    const notificationData: NotificationData = {
                        clientId: other.player.id,
                        notification: "Inventory Is Full...",
                        color: "#FF0000",
                        milliseconds: 3500
                    }
                    sendPlayerNotificationMessage(worldEngine.server, notificationData)
                }
            } else {
                // Send player inventory is full notification.
                const notificationData: NotificationData = {
                    clientId: other.player.id,
                    notification: "Inventory Is Full...",
                    color: "#FF0000",
                    milliseconds: 3500
                }
                sendPlayerNotificationMessage(worldEngine.server, notificationData)
            }
        }
    }

    worldEngine.registerEntity(itemDrop, worldEngine.server);
    worldEngine.registerEntity(itemPickupArrow, worldEngine.server)

    return itemDrop;
}