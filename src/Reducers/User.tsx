import { Handlers, createActions, createReducer } from "reduxsauce";
import Immutable from "seamless-immutable";
import { BASE_API } from "../Services/Api";
import { IUserData } from "../Transforms";

export type IUserStateImmutable = Immutable.ImmutableObject<IUserData>;

const INITIAL_STATE = Immutable<IUserData>({
  challenges_pending: [],
  mail: "",
  username: "",
  show: false,
  challenges_to_do: "",
  display_name: "",
  challenges_done: [],
  points: 0,
});

const { Types, Creators } = createActions({
  setUserData: ["data"],
  logout: null,
});

export { Types as UserActionsTypes, Creators as UserActions };

const login = (
  state: IUserStateImmutable,
  { data }: { data: IUserStateImmutable }
) => {
  if (!Immutable.isImmutable(state)) {
    state = Immutable.from(state);
  }
  return state.merge(data);
};

const logout = (state: IUserStateImmutable) => {
  if (!Immutable.isImmutable(state)) {
    state = Immutable.from(state);
  }
  return state.merge(INITIAL_STATE);
};

const HANDLERS: Handlers<IUserStateImmutable> = {
  [Types.SET_USER_DATA]: login,
  [Types.LOGOUT]: logout,
};

export const userReducer = createReducer(INITIAL_STATE, HANDLERS);
