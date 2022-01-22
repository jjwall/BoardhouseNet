import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { actionReticleAnim } from "../../modules/animations/animationdata/actionreticle";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { getWorldPosition, setPosition } from "../components/position";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { HitboxTypes, setHitbox } from "../components/hitbox";
import { setVelocity } from "../components/velocity";
import { Entity } from "../serverengine/entity";
import { setTimer } from "../components/timer";
import { Vector3 } from "three";

export function fireballPress(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    if (attackingEnt.movement) {
        attackingEnt.movement.actionOverride = fireballHold;
    }
}

export function fireballHold(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    if (attackingEnt.anim) {
        attackingEnt.anim.sequence = SequenceTypes.ACTION_HOLD;
    }

    if (!attackingEnt.actionReticle) {
        const offsetPosX = 150;
        const offsetPosY = 150;
        let unitCircleCoordinateX = 0;
        let unitCircleCoordinateY = 0;

        if (attackingEnt.movement) {
            if (attackingEnt.movement.right && attackingEnt.movement.up) {
                unitCircleCoordinateX = Math.sqrt(2) / 2;
                unitCircleCoordinateY = Math.sqrt(2) / 2;
            }
            else if (attackingEnt.movement.right && attackingEnt.movement.down) {
                unitCircleCoordinateX = Math.sqrt(2) / 2;
                unitCircleCoordinateY = -Math.sqrt(2) / 2;
            }
            else if (attackingEnt.movement.left && attackingEnt.movement.down) {
                unitCircleCoordinateX = -Math.sqrt(2) / 2;
                unitCircleCoordinateY = -Math.sqrt(2) / 2;
            }
            else if (attackingEnt.movement.left && attackingEnt.movement.up) {
                unitCircleCoordinateX = -Math.sqrt(2) / 2;
                unitCircleCoordinateY = Math.sqrt(2) / 2;
            }
            else if (attackingEnt.movement.up) {
                unitCircleCoordinateX = 0;
                unitCircleCoordinateY = 1;
            }
            else if (attackingEnt.movement.right) {
                unitCircleCoordinateX = 1;
                unitCircleCoordinateY = 0;
            }
            else if (attackingEnt.movement.down) {
                unitCircleCoordinateX = 0;
                unitCircleCoordinateY = -1;
            }
            else if (attackingEnt.movement.left) {
                unitCircleCoordinateX = -1;
                unitCircleCoordinateY = 0;
            }
            else {
                if (attackingEnt.pos.flipX) {
                    unitCircleCoordinateX = -1;
                    unitCircleCoordinateY = 0;
                }
                else {
                    unitCircleCoordinateX = 1;
                    unitCircleCoordinateY = 0;
                }
            }
        }
        
        let magicReticle = new Entity();
        magicReticle.pos = setPosition(offsetPosX * unitCircleCoordinateX, offsetPosY * unitCircleCoordinateY, 5);
        magicReticle.sprite = { url: "./data/textures/action_reticle001.png", pixelRatio: 8 };
        magicReticle.anim = { sequence: SequenceTypes.IDLE, blob: actionReticleAnim };

        // Set parent Since we're setting position relative to attacking ent.
        magicReticle.parent = attackingEnt;

        // Set action reticle reference.
        attackingEnt.actionReticle = magicReticle;

        worldEngine.registerEntity(magicReticle, worldEngine.server);
        broadcastCreateEntitiesMessage([magicReticle], worldEngine.server, worldEngine.worldType);
    }
    else {
        if (attackingEnt.movement) {
            const reticleWorldPos = getWorldPosition(attackingEnt.actionReticle);
            const scalar = 150;
            let angle = Math.atan2(reticleWorldPos.y - attackingEnt.pos.loc.y, reticleWorldPos.x - attackingEnt.pos.loc.x);
            // console.log(angle);

            // Change attacking char's direction when angle crosses above or below vertical axis.
            if (Math.abs(angle) > Math.PI / 2 || Math.abs(angle) > -Math.PI / 2) {
                attackingEnt.pos.flipX = true;
            }

            if (Math.abs(angle) < Math.PI / 2 || Math.abs(angle) < -Math.PI / 2) {
                attackingEnt.pos.flipX = false;
            }

            // Note: moves in wrong direction when in bottom left quandrant.
            if (attackingEnt.movement.right && attackingEnt.movement.up) {
                if (angle === Math.PI / 4) {
                    angle += 0;
                }
                else if (angle >= Math.PI / 4) {
                    angle -= Math.PI / 16;
                }
                else if (angle < Math.PI / 4) {
                    angle += Math.PI / 16;
                }
            }

            else if (attackingEnt.movement.right && attackingEnt.movement.down) {
                if (angle === -Math.PI / 4) {
                    angle += 0;
                }
                else if (angle >= -Math.PI / 4) {
                    angle -= Math.PI / 16;
                }
                else if (angle < -Math.PI / 4) {
                    angle += Math.PI / 16;
                }
            }

            else if (attackingEnt.movement.left && attackingEnt.movement.up) {
                // if (angle === -3 * Math.PI / 4) {
                //     angle += 0;
                // }
                if (angle >= 0) {
                    if (angle >= 3 * Math.PI / 4) {
                        angle -= Math.PI / 16;
                    }
                    else if (angle < 3 * Math.PI / 4) {
                        angle += Math.PI / 16;
                    }
                }
                else if (angle < 0) {
                    if (angle < -Math.PI / 4) {
                        angle -= Math.PI / 16;
                    }
                    else if (Math.abs(angle) < 3 * Math.PI / 4) {
                        angle += Math.PI / 16;
                    }
                }
            }

            // NOTE: Moves in wrong direction when in top left quandrant.
            else if (attackingEnt.movement.left && attackingEnt.movement.down) {
                if (angle === -3 * Math.PI / 4) {
                    angle += 0;
                }
                else if (angle < -3 * Math.PI / 4) {
                    angle += Math.PI / 16;
                }
                else if (angle >= -3 * Math.PI / 4) {
                    angle -= Math.PI / 16;
                }
                // if (angle >= 0) {
                //     if (angle >= Math.PI / 4) {
                //         angle += Math.PI / 16;
                //     }
                //     else if (angle < Math.PI / 4) {
                //         angle -= Math.PI / 16;
                //     }
                // }
                // else if (angle < 0) {
                //     if (angle < -3 * Math.PI / 4) {
                //         angle -= Math.PI / 16;
                //     }
                //     else if (Math.abs(angle) > Math.PI / 4) {
                //         angle += Math.PI / 16;
                //     }
                // }
            }

            else if (attackingEnt.movement.right) {
                if (angle === 0) {
                    angle += 0;
                }
                else if (angle >= 0) {
                    angle -= Math.PI / 16;
                }
                else if (angle < 0) {
                    angle += Math.PI / 16;
                }
            }
    
            else if (attackingEnt.movement.left) {
                if (Math.abs(angle) === Math.PI) {
                    angle += 0;
                }
                else if (angle >= 0) {
                    angle += Math.PI / 16;
                }
                else if (angle < 0) {
                    angle -= Math.PI / 16;
                }
            }

            else if (attackingEnt.movement.up) {
                if (angle >= 0) {
                    if (angle > Math.PI / 2) {
                        angle -= Math.PI / 16;
                    }
                    else if (angle <= Math.PI / 2) {
                        angle += Math.PI / 16;
                    }
                }
                else if (angle < 0) {
                    if (angle >= -Math.PI / 2) {
                        angle += Math.PI / 16;
                    }
                    else if (angle < -Math.PI / 2) {
                        angle -= Math.PI / 16;
                    }
                }
            }

            else if (attackingEnt.movement.down) {
                if (angle >= 0) {
                    if (angle >= Math.PI / 2) {
                        angle += Math.PI / 16;
                    }
                    else if (angle < Math.PI / 2) {
                        angle -= Math.PI / 16;
                    }
                }
                else if (angle < 0) {
                    if (angle >= -Math.PI / 2) {
                        angle -= Math.PI / 16;
                    }
                    else if (angle < -Math.PI / 2) {
                        angle += Math.PI / 16;
                    }
                }
            }

            attackingEnt.actionReticle.pos.loc = new Vector3(Math.cos(angle) * scalar, Math.sin(angle) * scalar, 5);
    
            // Update attacking ent. -> bug when anims stop -> just need to reset to idle?
            worldEngine.server.entityChangeList.push(attackingEnt);
            worldEngine.server.entityChangeList.push(attackingEnt?.actionReticle);
        }
    }
}

// Can spam - fix with cooldown.
export function fireballRelease(attackingEnt: Entity, worldEngine: BaseWorldEngine) {
    if (attackingEnt?.actionReticle) {
        // Get angle of reticle to player char.
        const reticleWorldPos = getWorldPosition(attackingEnt.actionReticle);
        const angle = Math.atan2(reticleWorldPos.y - attackingEnt.pos.loc.y, reticleWorldPos.x - attackingEnt.pos.loc.x);
        const fireballDirection = new Vector3(Math.cos(angle), Math.sin(angle), 5);

        // Create fireball and launch in direction of desired angle.
        let fireball = new Entity();
        fireball.pos = setPosition(attackingEnt.pos.loc.x, attackingEnt.pos.loc.y, 5);
        fireball.sprite = { url: "./data/textures/standardbullet.png", pixelRatio: 4 };
        fireball.vel = setVelocity(15, 0);
        fireball.vel.positional.add(fireballDirection.multiplyScalar(fireball.vel.acceleration));
        fireball.hitbox = setHitbox(HitboxTypes.PLAYER_FIREBALL, [HitboxTypes.TILE_OBSTACLE, HitboxTypes.ENEMY, HitboxTypes.HOSTILE_PLAYER], 25, 25);
        fireball.hitbox.onHit = (fireball, other, manifold) => {
            if (other.hitbox.collideType === HitboxTypes.TILE_OBSTACLE
                || other.hitbox.collideType === HitboxTypes.ENEMY) {
                broadcastDestroyEntitiesMessage([fireball], worldEngine.server, worldEngine);
            }
        }
        fireball.timer = setTimer(100, () => {
            broadcastDestroyEntitiesMessage([fireball], worldEngine.server, worldEngine);
        });

        // Register fireball ent and broadcast creation event.
        worldEngine.registerEntity(fireball, worldEngine.server);
        broadcastCreateEntitiesMessage([fireball], worldEngine.server, worldEngine.worldType);

        // Destroy reticle and free up reference.
        broadcastDestroyEntitiesMessage([attackingEnt.actionReticle], worldEngine.server, worldEngine);
        attackingEnt.actionReticle.parent = undefined;
        attackingEnt.actionReticle = undefined;
    }

    // Set character animation back to idle once Fireball has been cast.
    if (attackingEnt.anim) {
        attackingEnt.anim.sequence = SequenceTypes.IDLE;
    }

    // Free up reference to action override so player can resume movement.
    if (attackingEnt?.movement?.actionOverride) {
        attackingEnt.movement.actionOverride = undefined;
    }
}