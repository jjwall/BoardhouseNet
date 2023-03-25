export const createStore = (yourReducer: (...args: any) => any) => {
	let listeners: any[] = [];
	let currentState = yourReducer(undefined, {});

	return {
		getState: () => currentState,
		dispatch: (action: any) => {
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