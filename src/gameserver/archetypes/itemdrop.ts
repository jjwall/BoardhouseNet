import { itemPickupArrowAnim } from "../../modules/animations/animationdata/itempickuparrow";
import { PositionComponent, setPosition } from "../components/position";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { setHitbox, HitboxTypes } from "../components/hitbox";
import { setAnim } from "../components/animation";
import { setSprite } from "../components/sprite";
import { Entity } from "../serverengine/entity";

export function createItemDrop(worldEngine: BaseWorldEngine, pos: PositionComponent, itemUrl: string): Entity {
    let itemDrop = new Entity();
    itemDrop.pos = pos;
    itemDrop.sprite = setSprite(itemUrl)
    itemDrop.hitbox = setHitbox(HitboxTypes.ITEM_DROP, [HitboxTypes.PLAYER], 50, 50);
    itemDrop.hitbox.onHit = (self, other, manifold) => {
        console.log('Made contact with player: ')
        if (other.player) {
            console.log(other.player.id)
        }
    }

    let itemPickupArrow = new Entity();
    itemPickupArrow.pos = setPosition(0, 64, 3);
    itemPickupArrow.sprite = setSprite("./data/textures/vfx/item_pickup_arrow001.png", 4)
    itemPickupArrow.anim = setAnim(itemPickupArrowAnim)
    itemPickupArrow.parent = itemDrop

    worldEngine.registerEntity(itemDrop, worldEngine.server);
    worldEngine.registerEntity(itemPickupArrow, worldEngine.server)

    return itemDrop;
}