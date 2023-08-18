import { Handlers, createActions, createReducer } from "reduxsauce";
import Immutable from "seamless-immutable";
import { BASE_API } from "../Services/Api";

interface IAuthState {
  accessToken: string;
  expiresAt: string;
  idToken: string;
  refreshToken: string;
}

export type IAuthStateImmutable = Immutable.ImmutableObject<IAuthState>;

const INITIAL_STATE = Immutable<IAuthState>({
  accessToken: "",
  expiresAt: "",
  idToken: "",
  refreshToken: "",
});

const { Types, Creators } = createActions({
  loginSuccess: ["data"],
  logout: null,
});
export { Types as AuthActionsTypes, Creators as AuthActions };

const login = (
  state: IAuthStateImmutable,
  { data }: { data: IAuthStateImmutable }
) => {
  if (!Immutable.isImmutable(state)) {
    state = Immutable.from(state);
  }
  return state.merge(data);
};

const logout = (state: IAuthStateImmutable = INITIAL_STATE) => {
  if (!Immutable.isImmutable(state)) {
    state = Immutable.from(state);
  }
  BASE_API.deleteHeader("Authorization");
  return state.merge(INITIAL_STATE);
};

const HANDLERS: Handlers<IAuthStateImmutable> = {
  [Types.LOGIN_SUCCESS]: login,
  [Types.LOGOUT]: logout,
};

export const authReducer = createReducer(INITIAL_STATE, HANDLERS);

export const loggedIn = (state: IAuthStateImmutable) => {
  return state.accessToken !== INITIAL_STATE.accessToken;
};
