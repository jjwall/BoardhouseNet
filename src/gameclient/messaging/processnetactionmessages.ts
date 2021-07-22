import { NetMessagePlayerAttackDisplay } from "../../packets/netactionmessage";
import { ClientRender } from "../renders/clientrender";
import { setPosition } from "../components/position";
import { setSprite } from "../components/sprite";
import { Client } from "../clientengine/client";
import { Vector3 } from "three";

export function renderPlayerAttackAnim(message: NetMessagePlayerAttackDisplay, client: Client) {
    if (message.data.worldType === client.worldType) {
        console.log("Attack! - render from server");

        message.data.ents.forEach(entData => {
            // set up render archetypes methods?
            let clientRender = new ClientRender(120);
            const dir = new Vector3(entData.pos.dir.x, entData.pos.dir.y, entData.pos.dir.z);
            clientRender.pos = setPosition(entData.pos.loc.x, entData.pos.loc.y, entData.pos.loc.z, dir, entData.pos.flipX);
            clientRender.sprite = setSprite(entData.sprite.url, client.gameScene, client, entData.sprite.pixelRatio);
            clientRender.pos.teleport = entData.pos.teleport;

            if (entData.anim) {
                // clientEnt.anim = setAnim(...);
            }

            client.renderList.push(clientRender);
        });
    }
}