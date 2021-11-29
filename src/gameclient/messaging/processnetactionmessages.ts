import { NetMessagePlayerAttackDisplay } from "../../packets/messages/netactionmessage";
import { ClientRender } from "../renders/clientrender";
import { setPosition } from "../components/position";
import { setSprite } from "../components/sprite";
import { Client } from "../clientengine/client";
import { Vector3 } from "three";
import { changeSequence, setAnimation } from "../components/animation";
import { SequenceTypes } from "../../modules/animations/sequencetypes";

// This method will eventually be "renderPlayerSkill"
// Will clean up NetMessagePlayerAttackDisplay data
// Move away from copying position ref like -> clientRender.pos.loc = entDoingAction.pos.loc
// -> should instead use some sort of "follow" logic, which is where we could account for offset X & Y
export function renderPlayerAttackAnim(message: NetMessagePlayerAttackDisplay, client: Client) {
    if (message.data.worldType === client.worldType) {
        console.log("Attack! - render from server");

        message.data.ents.forEach(entData => {
            // set up render archetypes methods?
            let clientRender = new ClientRender(message.data.renderDuration);
            const dir = new Vector3(entData.pos.dir.x, entData.pos.dir.y, entData.pos.dir.z);

            if (message.data.renderTracksCaster) {
                const entDoingAction = client.NetIdToEntityMap[message.data.entDoingActionNetId]

                // where and how we change anim?
                // entDoingAction.anim = changeSequence(SequenceTypes.ATTACK, entDoingAction.anim)

                clientRender.pos = {
                    loc: undefined,
                    dir: dir,
                    wrap: undefined,
                    flipX: entData.pos.flipX,
                    teleport: true,
                }
                clientRender.pos.dir = dir
                clientRender.pos.loc = entDoingAction.pos.loc

                // vvv this changes for entDoingAction too since it's a reference vvv

                // clientRender.pos.loc.setZ(clientRender.pos.loc.z + 1)
                // clientRender.pos.loc.setX(clientRender.pos.loc.x + message.data.offsetPosX)
                // clientRender.pos.loc.setY(clientRender.pos.loc.y + message.data.offsetPosY)
            }
            else {
                clientRender.pos = setPosition(entData.pos.loc.x, entData.pos.loc.y, entData.pos.loc.z, dir, entData.pos.flipX);
                clientRender.pos.teleport = entData.pos.teleport;
            }

            clientRender.sprite = setSprite(entData.sprite.url, client.gameScene, client, entData.sprite.pixelRatio);

            if (entData.anim) {
                clientRender.anim = setAnimation(entData.anim.sequence, entData.anim.blob);
            }

            client.renderList.push(clientRender);
        });
    }
}