import { Rect, getHitbox, getManifold } from "../components/hitbox";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";

export function worldEdgeSystem(ents: readonly Entity[], worldEngine: BaseWorldEngine) {
    for (const ent of ents) {
        if (ent.pos && ent.hitbox) {
            const hitbox: Rect =
                ent.hitbox ? getHitbox(ent) :
                { left: ent.pos.loc.x, right: ent.pos.loc.x, bottom: ent.pos.loc.y, top: ent.pos.loc.y };

            const worldBox: Rect = { left: -worldEngine.worldWidth/2, right: worldEngine.worldWidth/2, bottom: -worldEngine.worldHeight/2, top: worldEngine.worldHeight/2 };

            const manifold = getManifold(hitbox, worldBox);

            if (ent.pos.wrap) {
                if (manifold.right < worldBox.left) {
                    ent.pos.loc.x += worldBox.right - hitbox.left;
                }
                if (manifold.left > worldBox.right) {
                    ent.pos.loc.x -= hitbox.right - worldBox.left;
                }
                if (manifold.top < worldBox.bottom) {
                    ent.pos.loc.y += worldBox.top - hitbox.bottom;
                }
                if (manifold.bottom > worldBox.top) {
                    ent.pos.loc.y -= hitbox.top - worldBox.bottom;
                }
            } else {
                if (hitbox.left < worldBox.left) {
                    ent.pos.loc.x += worldBox.left - hitbox.left;
                }
                if (hitbox.right > worldBox.right) {
                    ent.pos.loc.x += worldBox.right - hitbox.right;
                }
                if (hitbox.bottom < worldBox.bottom) {
                    ent.pos.loc.y += worldBox.bottom - hitbox.bottom;
                }
                if (hitbox.top > worldBox.top) {
                    ent.pos.loc.y += worldBox.top - hitbox.top;
                }
            }
        }
    }
}