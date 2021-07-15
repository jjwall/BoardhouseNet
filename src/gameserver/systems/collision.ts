import { Rect, Manifold, getHitbox, getManifold, HitboxComponent, HitboxTypes } from "./../components/hitbox";
import { PositionComponent } from "./../components/position";
import { Entity } from "../server/entity";

/**
 * Collision system.
 * @param ents List of ents to run system with. Hitting ents must have hitBox and pos components.
 */
export function collisionSystem(ents: ReadonlyArray<Entity>) {
    type Body = {
        ent: Entity;
        rect: Rect;
    };

    const tryOnHit = (a: Entity, b: Entity, m: Manifold) => {
        if (a.hitbox.onHit && a.hitbox.collidesWith.includes(b.hitbox.collideType)) {
            a.hitbox.onHit(a, b, m);
        }
    };

    const allBodies = ents
        .filter(e => e.hitbox && e.pos)
        .map((e): Body => ({ ent: e, rect: getHitbox(e) }));

    allBodies.sort((a, b) => a.rect.left - b.rect.left);

    let bodyWindow = [] as Body[];

    for (const body of allBodies) {
        bodyWindow = bodyWindow.filter(otherBody => body.rect.left <= otherBody.rect.right);

        for (const otherBody of bodyWindow) {
            const manifold = getManifold(body.rect, otherBody.rect);

            if (manifold.width > 0 && manifold.height > 0) {
                // console.log('hit');
                tryOnHit(body.ent, otherBody.ent, manifold);
                tryOnHit(otherBody.ent, body.ent, manifold);
            }
        }

        bodyWindow.push(body);
    }
}

// type Entity = {
//     pos: PositionComponent;
//     hitBox: HitBoxComponent;
//     hitBoxTypes: HitBoxTypes;
// }