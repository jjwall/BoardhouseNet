import { BaseWorldEngine } from "../serverengine/baseworldengine";
import { Entity } from "../serverengine/entity";

export interface BehaviorComponent {
    root: () => Behavior;
    current: Behavior | undefined;
}

export enum BehaviorResult {
    SUCCESS,
    FAIL
}

export interface BehaviorNextParams {
    worldEngine: BaseWorldEngine;
    ents: Entity[];
    self: Entity;
}

export type Behavior = Generator<Entity, BehaviorResult, {
    worldEngine: BaseWorldEngine, 
    ents: readonly Entity[], 
    self: Entity 
}>;

export function setBehavior(root: () => Behavior): BehaviorComponent {
    const behavior: BehaviorComponent = {
        root: root,
        current: undefined,
    };

    return behavior;
}

export function sequence(...behaviors: (() => Behavior)[]) {
    return function* (): Behavior {
        for (const b of behaviors) {
            const result = yield* b();

            if (result === BehaviorResult.FAIL) {
                return BehaviorResult.FAIL;
            }
        }

        return BehaviorResult.SUCCESS;
    };
}

export function choice(...behaviors: (() => Behavior)[]): () => Behavior {
    return function* (): Behavior {
        for (const b of behaviors) {
            const result = yield* b();

            if (result === BehaviorResult.SUCCESS) {
                return BehaviorResult.SUCCESS;
            }
        }

        return BehaviorResult.FAIL;
    };
}