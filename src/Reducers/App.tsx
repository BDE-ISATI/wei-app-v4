import { Handlers, createActions, createReducer } from "reduxsauce";
import Immutable from "seamless-immutable";

interface IAppState {
  colorMode: "light" | "dark";
}

export type IAppStateImmutable = Immutable.ImmutableObject<IAppState>;

const INITIAL_STATE = Immutable<IAppState>({
  colorMode: "dark",
});

const { Types, Creators } = createActions({
  setColorMode: ["mode"],
});
export { Types as AppActionsTypes, Creators as AppActions };

const setColorMode = (
  state: IAppStateImmutable,
  { mode }: { mode: "light" | "dark" }
) => {
  if (!Immutable.isImmutable(state)) {
    state = Immutable.from(state);
  }
  return state.merge({ colorMode: mode });
};

const HANDLERS: Handlers<IAppStateImmutable> = {
  [Types.SET_COLOR_MODE]: setColorMode,
};

export const appReducer = createReducer(INITIAL_STATE, HANDLERS);
