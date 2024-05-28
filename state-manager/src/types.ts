import StateManager from "./state-manager";

export type State = Record<string, unknown>;
export type Listener<S extends State> = (updatedState: S) => void;

export type Middleware<S extends State> = (
  stateManager: StateManager<S, Listener<S>, Middleware<S>>,
  next: (action: Action<S>) => void
) => (action: Action<S>) => void;

export type Action<State> = UpdateAction<State> | ResetAction;

export enum ActionTypes {
  UPDATE_STATE = "UPDATE_STATE",
  RESET_STATE = "RESET_STATE",
}
export interface UpdateAction<State> {
  type: ActionTypes.UPDATE_STATE;
  payload: Partial<State>;
}
export interface ResetAction {
  type: ActionTypes.RESET_STATE;
}
