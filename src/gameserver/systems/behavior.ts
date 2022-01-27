import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";

export function behaviorSystem(ents: readonly Entity[], worldEngine: BaseWorldEngine) {
    for (const e of ents) {
        if (e.behavior) {
            if (e.behavior.current) {
                if (e.behavior.current.next({ worldEngine, ents, self: e }).done) {
                    e.behavior.current = undefined;
                }
            } else {
                e.behavior.current = e.behavior.root();
            }
        }
    }
}