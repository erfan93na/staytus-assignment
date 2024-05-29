import StateManager, {
  Action,
  ActionTypes,
  State as StateType,
  Middleware,
  UpdateAction,
  ResetAction,
} from ".";

interface TestState extends StateType {
  count: number;
}

const loggerMiddleware: Middleware<TestState> =
  (stateManager, next) => (action) => {
    console.log("Action dispatched:", action);
    next(action);
  };

const asyncMiddleware: Middleware<TestState> =
  (stateManager, next) => async (action) => {
    if (action.type === ActionTypes.UPDATE_STATE) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    next(action);
  };

describe("StateManager", () => {
  let initialState: TestState;
  let stateManager: StateManager<TestState>;
  let updateAction: UpdateAction<TestState>;
  let resetAction: ResetAction;

  beforeEach(() => {
    initialState = { count: 0 };
    stateManager = new StateManager(initialState, [
      loggerMiddleware,
      asyncMiddleware,
    ]);
    updateAction = stateManager.getActions().updateState({ count: 10 });
    resetAction = stateManager.getActions().resetState();
  });

  test("should initialize with given state", () => {
    expect(stateManager.getState()).toEqual(initialState);
  });

  test("should update state and notify listeners", async () => {
    const listener = jest.fn();
    stateManager.subscribe(listener);

    await stateManager.dispatch(updateAction);
    expect(stateManager.getState()).toEqual({ count: 10 });
    expect(listener).toHaveBeenCalledWith({ count: 10 });
  });

  test("should reset state and notify listeners", async () => {
    const listener = jest.fn();
    stateManager.subscribe(listener);

    stateManager.dispatch(resetAction);
    await stateManager.dispatch(updateAction);
    expect(stateManager.getState()).toEqual({ count: 10 });
    expect(listener).toHaveBeenCalledWith({ count: 10 });

    await stateManager.dispatch(resetAction);
    expect(stateManager.getState()).toEqual({ count: 0 });
    expect(listener).toHaveBeenCalledWith({ count: 0 });
  });

  test("should allow listeners to unsubscribe", async () => {
    const listener = jest.fn();
    const unsubscribe = stateManager.subscribe(listener);

    unsubscribe();
    await stateManager.dispatch(updateAction);

    expect(listener).not.toHaveBeenCalled();
  });

  test("should apply middlewares in order", async () => {
    const loggerSpy = jest.spyOn(console, "log");
    const listener = jest.fn();
    stateManager.subscribe(listener);

    await stateManager.dispatch(updateAction);

    expect(loggerSpy).toHaveBeenCalledWith("Action dispatched:", updateAction);
    expect(stateManager.getState()).toEqual({ count: 10 });
    expect(listener).toHaveBeenCalledWith({ count: 10 });

    loggerSpy.mockRestore();
  });
  test("should update state with no middlewares present", async () => {
    stateManager = new StateManager(initialState);
    const listener = jest.fn();
    stateManager.subscribe(listener);

    await stateManager.dispatch(updateAction);
    expect(stateManager.getState()).toEqual({ count: 10 });
  });
  test("should handle unknown action type", async () => {
    const unknownAction: Action<TestState> = {
      type: "UNKNOWN_ACTION" as ActionTypes,
      payload: {},
    };
    try {
      await stateManager.dispatch(unknownAction);
    } catch (err) {
      expect(err.message).toBe("Unknown action type");
    }
  });
});
