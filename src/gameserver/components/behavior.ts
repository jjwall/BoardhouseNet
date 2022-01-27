export interface BehaviorComponent {
    root: () => Behavior;
    current: Behavior;
}

export enum BehaviorResult {
    SUCCESS,
    FAIL
}

export type Behavior = Generator;

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