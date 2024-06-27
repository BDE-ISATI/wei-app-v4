import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {PERSIST_CONFIG} from "../Config/PersistConfig";
import {FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE,} from "redux-persist";
import {authReducer, IAuthStateImmutable} from "./Auth";
import {IUserStateImmutable, userReducer} from "./User";
import {appReducer, IAppStateImmutable} from "./App";

export interface IState {
    auth: IAuthStateImmutable;
    user: IUserStateImmutable;
    app: IAppStateImmutable;
}


export default configureStore({
    reducer: persistReducer(PERSIST_CONFIG.storeConfig, combineReducers({
        auth: authReducer,
        user: userReducer,
        app: appReducer,
    })),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
