import { MeshBasicMaterial, NearestFilter, Mesh } from "three";
import { ClientEntity } from "../clientengine/cliententity";
import { AnimationComponent } from "./../components/animation";
import { Client } from "../clientengine/client";
import { ClientRender } from "../renders/clientrender";

/**
 * Animation System.
 * @param ents Lists of ents to run system with. Must have anim and sprite components.
 */
export function animationSystem(ents: ReadonlyArray<ClientEntity | ClientRender>, client: Client) : void {
    ents.forEach(ent => {
        if (ent.anim && ent.sprite) {
            ent.anim.ticks--;

            if (ent.anim.changingSequence) {
                ent.anim.changingSequence = false;
                ent.anim.ticks = ent.anim.blob[ent.anim.sequence][ent.anim.frame].ticks;

                const newSpriteMap = client.getTexture(ent.anim.blob[ent.anim.sequence][ent.anim.frame].texture);
                newSpriteMap.magFilter = NearestFilter;
                ent.sprite.material = new MeshBasicMaterial({ map: newSpriteMap, transparent: true });
            } else if (ent.anim.ticks <= 0) {
                ent.anim.frame = ent.anim.blob[ent.anim.sequence][ent.anim.frame].nextFrame;
                ent.anim.ticks = ent.anim.blob[ent.anim.sequence][ent.anim.frame].ticks;

                const newSpriteMap = client.getTexture(ent.anim.blob[ent.anim.sequence][ent.anim.frame].texture);
                newSpriteMap.magFilter = NearestFilter;
                ent.sprite.material = new MeshBasicMaterial({ map: newSpriteMap, transparent: true });
            }
        }
    });
}

// type Entity = {
//     anim: AnimationComponent;
//     sprite: Mesh;
// }