export interface Actions {
    [key: string]: {
        type: ActionTypes
    }
}

export enum ActionTypes {
    INCREMENT = 'INCREMENT',
    DECREMENT = 'DECREMENT'
}

export const actions = {
    increment: { type: ActionTypes.INCREMENT },
    decrement: { type: ActionTypes.DECREMENT }
};