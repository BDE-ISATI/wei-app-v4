import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { PERSIST_CONFIG } from "../Config/PersistConfig";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { authReducer, IAuthStateImmutable } from "./Auth";
import { userReducer, IUserStateImmutable } from "./User";
import { appReducer, IAppStateImmutable } from "./App";

export interface IState {
  auth: IAuthStateImmutable;
  user: IUserStateImmutable;
  app: IAppStateImmutable;
}

const reducers = combineReducers<IState>({
  auth: authReducer,
  user: userReducer,
  app: appReducer,
});

const persistedReducer = persistReducer(PERSIST_CONFIG.storeConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
