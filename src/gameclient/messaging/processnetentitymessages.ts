import { NetMessageCreateEntities, NetMessageDestroyEntities, NetMessageUpdateEntities } from "../../packets/messages/netentitymessage";
import { changeSequence, setAnimation } from "../components/animation";
import { setStatusComponentAndGraphic } from "../components/status";
import { ClientEntity } from "../clientengine/cliententity";
import { setHitboxGraphic } from "../components/hitbox";
import { setPosition } from "../components/position";
import { setSprite } from "../components/sprite";
import { Client } from "../clientengine/client";
import { PlaneGeometry, Vector3 } from "three";

// Create front-end representations of EntData list. Should pass in all entities
// using the "global" ecsKey when a player or spectator first joins (or scene transition happens).
export function createEntities(message: NetMessageCreateEntities, client: Client) {
    if (message.data.worldType === client.worldType) {
        message.data.ents.forEach(entData => {
            console.log("create entity front");
            console.log(entData);

            // Create a front-end entity for the client that will represent a back-end entity.
            // Don't create the ent twice if it had already been created.
            if (!client.NetIdToEntityMap[entData.netId]) {
                let clientEnt = new ClientEntity();
                const dir = new Vector3(entData.pos.dir.x, entData.pos.dir.y, entData.pos.dir.z);
                clientEnt.netId = entData.netId;
                clientEnt.pos = setPosition(entData.pos.loc.x, entData.pos.loc.y, entData.pos.loc.z, dir, entData.pos.flipX);
                clientEnt.sprite = setSprite(entData.sprite.url, client.gameScene, client, entData.sprite.pixelRatio);
                clientEnt.pos.teleport = entData.pos.teleport;

                if (entData.parentNetId)
                    clientEnt.parentNetId = entData.parentNetId;

                if (entData.hitbox)
                    setHitboxGraphic(client, clientEnt.sprite, entData.hitbox);

                if (entData.anim) {
                    clientEnt.anim = setAnimation(entData.anim.sequence, entData.anim.blob);
                }

                if (entData.status) {
                    // if (client.currentClientId !== entData.player.id)
                        clientEnt.status = setStatusComponentAndGraphic(client, clientEnt.sprite, entData.status);
                }

                if (entData.player) {
                    clientEnt.player = entData.player;

                    // Set player ent reference if client id matches player id.
                    if (client.currentClientId === entData.player.id) {
                        client.currentPlayerEntity = clientEnt;
                        // Client player ents should have +1 to their z index so they are always rendered over other player ents.
                        client.currentPlayerEntity.pos.loc.z++;
                    }
                }

                client.entityList.push(clientEnt);
                client.NetIdToEntityMap[entData.netId] = clientEnt;
            }
        });
    }
}

// Update front end representation of EntData list.
export function updateEntities(message: NetMessageUpdateEntities, client: Client) {
    if (message.data.worldType === client.worldType) {
        message.data.ents.forEach(entData => {
            if (client.NetIdToEntityMap[entData.netId]) {
                let clientEnt = client.NetIdToEntityMap[entData.netId];

                if (clientEnt.sprite && clientEnt.pos) {
                    clientEnt.pos.loc.setX(entData.pos.loc.x);
                    clientEnt.pos.loc.setY(entData.pos.loc.y);
                    clientEnt.pos.dir.setX(entData.pos.dir.x);
                    clientEnt.pos.dir.setY(entData.pos.dir.y);
                    clientEnt.pos.teleport = entData.pos.teleport;
                    clientEnt.pos.flipX = entData.pos.flipX;
                }
        
                if (clientEnt.anim) {
                    clientEnt.anim = changeSequence(entData.anim.sequence, clientEnt.anim);
                }

                // example on updating UI
                // if (clientEnt.player) {
                //     if (client.currentClientId === entData.player.id) {
                //         client.rootComponent.updateStatus()
                //     }
                // }

                if (clientEnt.status) {
                    if (clientEnt.status.currentHp !== entData.status.currentHp) {
                        // Update current hp and hp bar to reflect hp changes.
                        clientEnt.status.currentHp = entData.status.currentHp;
                        clientEnt.status.hpBarMesh.geometry = new PlaneGeometry((clientEnt.status.currentHp / clientEnt.status.maxHp) * clientEnt.status.maxHpBarWidth, clientEnt.status.hpBarHeight);
                        const { width: prevWidth, height: prevHeight } = (clientEnt.status.hpBarMesh.geometry as PlaneGeometry).parameters;
                        clientEnt.status.hpBarMesh.geometry.translate(prevWidth/2, -prevHeight/2, 0);

                        // Example if we showed both status plate and ui
                        // if (client.currentClientId === entData.player.id) {
                        //     client.rootComponent.updateStatus()
                        // }
                    }

                    if (clientEnt.status.maxHp !== entData.status.maxHp) {
                        // Update max hp and hp bar to reflect hp upgrade.
                        clientEnt.status.maxHp = entData.status.maxHp;
                        clientEnt.status.hpBarMesh.geometry = new PlaneGeometry((clientEnt.status.currentHp / clientEnt.status.maxHp) * clientEnt.status.maxHpBarWidth, clientEnt.status.hpBarHeight);
                        const { width: prevWidth, height: prevHeight } = (clientEnt.status.hpBarMesh.geometry as PlaneGeometry).parameters;
                        clientEnt.status.hpBarMesh.geometry.translate(prevWidth/2, -prevHeight/2, 0);
                    }

                    if (clientEnt.status.level !== entData.status.level) {
                        // Update level text and shadow meshes.
                        clientEnt.status.level = entData.status.level;
                        clientEnt.status.levelTextMesh.geometry = client.getTextGeometry(`Lv: ${entData.status.level}`, clientEnt.status.levelFontUrl, clientEnt.status.levelFontSize);
                        clientEnt.status.levelTextShadowMesh.geometry = client.getTextGeometry(`Lv: ${entData.status.level}`, clientEnt.status.levelFontUrl, clientEnt.status.levelFontSize);
                    }
                }
            }
        });
    }
}

// Destroy front end representations EntData list.
export function destroyEntities(message: NetMessageDestroyEntities, client: Client) {
    if (message.data.worldType === client.worldType) {
        message.data.ents.forEach(entData => {
            console.log("destroy entity front");
            const entToDestroy = client.NetIdToEntityMap[entData.netId];
            console.log(client.entityList);

            // Remove from entityList.
            if (client.entityList.indexOf(entToDestroy) !== -1) {
                client.entityList.splice(client.entityList.indexOf(entToDestroy), 1);
            }

            console.log("removing ent from entity list");
            console.log(client.entityList);
        
            // Remove from NetId to Entity map.
            if (client.NetIdToEntityMap[entData.netId]) {
                delete client.NetIdToEntityMap[entData.netId];

                // Remove sprite from scene.
                if (entToDestroy.sprite) {
                    client.gameScene.remove(entToDestroy.sprite);
                }
            }
        });
    }
}