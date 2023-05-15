export function createStore<S, A>(yourReducer: (state: S, action: A | {}) => S) {
	let listeners: any[] = [];
	let currentState = yourReducer(undefined, {});

	return {
		getState: () => currentState,
		dispatch: (action: A) => {
			currentState = yourReducer(currentState, action);

			listeners.forEach((listener) => {
				listener();
			});
		},
		subscribe: (newListener: any) => {
			listeners.push(newListener);

			const unsubscribe = () => {
				listeners = listeners.filter((l) => l !== newListener);
			};

			return unsubscribe;
		}
	};
};
