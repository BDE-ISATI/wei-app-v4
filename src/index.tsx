import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import store from "./Reducers";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {BASE_API} from "./Services/Api";
import {loggedIn} from "./Reducers/Auth";

let persistor = persistStore(store);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const onBeforeLift = () => {
    if (loggedIn(store.getState().auth)) {
        const authData = store.getState().auth;
        BASE_API.setHeader(
            "Authorization",
            authData.tokenType + " " + authData.idToken
        );
    }
};

root.render(
    //<React.StrictMode>
    <Provider store={store}>
        <PersistGate
            loading={null}
            persistor={persistor}
            onBeforeLift={onBeforeLift}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <App/>
            </LocalizationProvider>
        </PersistGate>
    </Provider>
    //</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
