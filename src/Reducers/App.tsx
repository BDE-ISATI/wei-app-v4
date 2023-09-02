import { Handlers, createActions, createReducer } from "reduxsauce";
import Immutable from "seamless-immutable";

interface IAppState {
  colorMode: "light" | "dark";
  prompts: { [key: string]: string };
}

export type IAppStateImmutable = Immutable.ImmutableObject<IAppState>;

const INITIAL_STATE = Immutable<IAppState>({
  colorMode: "dark",
  prompts: {},
});

const { Types, Creators } = createActions({
  setColorMode: ["mode"],
  setPromptDate: ["name", "date"],
  reset: null,
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

const setPromptDate = (
  state: IAppStateImmutable,
  { name, date }: { name: string; date: string }
) => {
  if (!Immutable.isImmutable(state)) {
    state = Immutable.from(state);
  }
  var newPrompts = state.prompts.asMutable();
  newPrompts[name] = date;
  return state.merge({ prompts: newPrompts });
};

const reset = (state: IAppStateImmutable) => {
  return INITIAL_STATE;
};

const HANDLERS: Handlers<IAppStateImmutable> = {
  [Types.SET_COLOR_MODE]: setColorMode,
  [Types.SET_PROMPT_DATE]: setPromptDate,
  [Types.RESET]: reset,
};

export const appReducer = createReducer(INITIAL_STATE, HANDLERS);
