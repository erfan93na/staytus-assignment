import {
  Action,
  ActionTypes,
  State as StateType,
  Listener as ListenerType,
  Middleware as MiddlewareType,
} from "./types";
class StateManager<
  State extends StateType,
  Listener extends ListenerType<State>,
  Middleware extends MiddlewareType<State>
> {
  private state: Readonly<State>;
  listeners: Set<Listener>;
  middlewares: Array<Middleware>;
  constructor(initialState: State, middlewares: Array<Middleware>) {
    this.state = initialState;
    this.listeners = new Set();
    this.middlewares = middlewares;
  }
  private notify() {
    this.listeners.forEach((cb) => cb?.(this.state));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  setState(newState: Partial<State>) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
  getState() {
    return this.state;
  }
  getActions() {
    return {
      updateState: (payload: Partial<State>) => ({
        type: ActionTypes.UPDATE_STATE,
        payload,
      }),
      resetState: () => ({
        type: ActionTypes.RESET_STATE,
      }),
    };
  }
  dispatch(action: Action<State>) {
    const chain = this.middlewares.reduceRight(
      (next, middleware) => (action) => middleware(this, next)(action),
      (action: Action<State>) => this.applyAction(action)
    );
    chain(action);
  }
  applyAction(action: Action<State>) {
    switch (action.type) {
      case ActionTypes.UPDATE_STATE:
        this.setState(action.payload);
        break;
      case ActionTypes.RESET_STATE:
        this.setState({});
        break;
      default:
        throw new Error("Unknown action type");
    }
  }
}
export default StateManager;
