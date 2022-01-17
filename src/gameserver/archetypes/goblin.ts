import { broadcastCreateEntitiesMessage, broadcastDestroyEntitiesMessage } from "../messaging/sendnetentitymessages";
import { kenneyGoblinAnim } from "../../modules/animations/animationdata/kenneygoblin";
import { SequenceTypes } from "../../modules/animations/sequencetypes";
import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { PositionComponent } from "../components/position"
import { Entity } from "../serverengine/entity";
import { setTimer } from "../components/timer";

export function createGoblin(worldEngine: BaseWorldEngine, pos: PositionComponent) {
    let goblin = new Entity();
    goblin.pos = pos;
    goblin.pos.flipX = true;
    goblin.sprite = { url: "./data/textures/kenney_goblin001.png", pixelRatio: 4 };
    goblin.anim = { sequence: SequenceTypes.WALK, blob: kenneyGoblinAnim };

    worldEngine.registerEntity(goblin, worldEngine.server);
    broadcastCreateEntitiesMessage([goblin], worldEngine.server, worldEngine.worldType);
}

function moveToRandomPoint(goblinEnt: Entity) {
    const randomTickAmount = 5;
    goblinEnt.timer = setTimer(randomTickAmount, () => {
        // move... ?
        moveToRandomPoint(goblinEnt);
    });
}