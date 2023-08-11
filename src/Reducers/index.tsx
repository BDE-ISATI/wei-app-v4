import { combineReducers, Store } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { PERSIST_CONFIG } from "../Config/PersistConfig";
import { persistReducer } from "redux-persist";
import { authReducer, IAuthStateImmutable } from "./Auth";

export interface IState {
  auth: IAuthStateImmutable;
}

let store: Store<IState>;

export { store };

export default () => {
  const reducers = combineReducers<IState>({
    auth: authReducer,
  });
  const reducer = persistReducer(PERSIST_CONFIG.storeConfig, reducers);

  store = configureStore({ reducer });
};
