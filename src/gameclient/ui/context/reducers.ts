import { actions, Actions } from "./actions";

export const countReducer = (state: any, action: any) => {
    switch (action.type) {
      case actions.increment.type:
        return {
          count: state.count + 1
        };
  
      case actions.decrement.type:
        return {
          count: state.count - 1
        };
  
      default:
        return state;
    }
  };