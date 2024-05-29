import {
  Action,
  ActionTypes,
  State as StateType,
  Listener,
  Middleware,
} from "./types";

class StateManager<State extends StateType> {
  private state: Readonly<State>;
  private initialState: State;
  listeners: Set<Listener<State>>;
  middlewares: Array<Middleware<State>>;

  constructor(initialState: State, middlewares: Array<Middleware<State>> = []) {
    this.state = initialState;
    this.initialState = initialState;
    this.listeners = new Set();
    this.middlewares = middlewares;
  }

  private notify() {
    this.listeners.forEach((cb) => cb?.(this.state));
  }

  subscribe(listener: Listener<State>) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setState(newState: Partial<State>) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  getState() {
    return this.state;
  }

  // Method to get actions for updating or resetting the state
  getActions() {
    return {
      updateState: (payload: Partial<State>) =>
        ({
          type: ActionTypes.UPDATE_STATE,
          payload,
        } as const),
      resetState: () =>
        ({
          type: ActionTypes.RESET_STATE,
        } as const),
    };
  }

  // Method to dispatch an action through middlewares and update state
  dispatch(action: Action<State>): Promise<State> {
    return new Promise((resolve, reject) => {
      // Create a middleware chain that calls each middleware in order
      const chain = this.middlewares.reduceRight(
        (next, middleware) => (action) => middleware(this, next)(action),
        // Final function to apply action after all middlewares have run
        (action: Action<State>) => {
          const error = this.applyAction(action);
          if (error) {
            reject(error);
          }
          resolve(this.getState());
        }
      );
      // Start the chain with the action
      chain(action);
    });
  }

  // Private method to apply action and update state accordingly
  private applyAction(action: Action<State>) {
    switch (action.type) {
      case ActionTypes.UPDATE_STATE:
        this.setState(action.payload);
        break;
      case ActionTypes.RESET_STATE:
        this.setState(this.initialState);
        break;
      default:
        return new Error("Unknown action type");
    }
  }
}
export default StateManager;
