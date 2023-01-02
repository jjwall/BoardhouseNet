import { itemPickupArrowAnim } from "../../modules/animations/animationdata/itempickuparrow";
import { broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { PositionComponent, setPosition } from "../components/position";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setHitbox, HitboxTypes } from "../components/hitbox";
import { setAnim } from "../components/animation";
import { setSprite } from "../components/sprite";
import { Entity } from "../serverengine/entity";
import { broadcastPlayerItemPickupMessage } from "../messaging/sendnetworldmessages";
import { ItemPickupData } from "../../packets/data/itemdata";

export function createItemDrop(worldEngine: BaseWorldEngine, pos: PositionComponent, itemUrl: string): Entity {
    let itemDrop = new Entity();
    itemDrop.pos = pos;
    itemDrop.sprite = setSprite(itemUrl)
    itemDrop.hitbox = setHitbox(HitboxTypes.ITEM_DROP, [HitboxTypes.PLAYER], 50, 50);

    let itemPickupArrow = new Entity();
    itemPickupArrow.pos = setPosition(0, 64, 3);
    itemPickupArrow.sprite = setSprite("./data/textures/vfx/item_pickup_arrow001.png", 4)
    itemPickupArrow.anim = setAnim(itemPickupArrowAnim)
    itemPickupArrow.parent = itemDrop

    itemDrop.hitbox.onHit = (self, other, manifold) => {
        if (other.player) {
            console.log('Made contact with player: ')
            console.log(other.player.id)

            // if (other.player.inventory.length + 1 < other.player.inventory.bagsize...)

            // Todo: Account for player having full inventory before removing item drop from world.
            broadcastDestroyEntitiesMessage(
                [itemDrop, itemPickupArrow], 
                worldEngine.server, 
                worldEngine
            );

            // if bag size not full then...
            const itemPickupData: ItemPickupData = {
                pickupClientId: other.player.id,
                url: itemUrl,
            }
            broadcastPlayerItemPickupMessage(worldEngine.server, itemPickupData,)

            // else ... sendPlayerInventoryFullMessage
        }
    }

    worldEngine.registerEntity(itemDrop, worldEngine.server);
    worldEngine.registerEntity(itemPickupArrow, worldEngine.server)

    return itemDrop;
}