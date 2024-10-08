import React, {useEffect} from "react";
import "./App.css";
import {Box, createTheme} from "@mui/material";

import {BottomBar} from "./Components/BottomBar";
import {Account, ChallengeList, ScoreBoard} from "./Containers";
import {ThemeProvider} from "@emotion/react";
import {LoginScreen} from "./Containers/LoginScreen";

import {createBrowserRouter, Outlet, RouterProvider, useNavigate,} from "react-router-dom";
import {RegisterScreen} from "./Containers/RegisterScreen";
import {TeamsList} from "./Containers/TeamsList";
import Challenge from "./Containers/Challenge/Challenge";
import {useDispatch, useSelector} from "react-redux";
import {IState} from "./Reducers";
import {AppActions} from "./Reducers/App";
import {EditProfile} from "./Containers/EditProfile";
import {loggedIn} from "./Reducers/Auth";
import Api from "./Services/Api";
import {CreateChallenge} from "./Containers/CreateChallenge";
import {EditChallenge} from "./Containers/EditChallenge";
import {ChallengeRequest} from "./Containers/ChallengeRequests";
import {Team} from "./Containers/Team";
import {CreateTeam} from "./Containers/CreateTeam";
import {EditTeam} from "./Containers/EditTeam";
import {TeamRequests} from "./Containers/TeamRequests";
import {NewsList} from "./Containers/NewsList";
import {MyChallenges} from "./Containers/MyChallenges";
import InstallPWA from "./Components/InstallPWA/InstallPWA";
import {UserDetails} from "./Containers/UserDetails";
import { Anecdotes } from "./Containers/Anecdotes";
import { ResetPasswordScreen } from "./Containers/ResetPasswordScreen";

const ColorModeContext = React.createContext({
    toggleColorMode: () => {
    }
});

const RedirectTo: React.FC<{ path: string }> = (props: { path: string }) => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(props.path);
    });
    return <></>;
};

export default function App() {
    const mode: "light" | "dark" = useSelector(
        (state: IState) => state.app.colorMode
    );
    const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (userLoggedIn) {
            Api.apiCalls.GET_SELF();
        }
    }, []);

    const BottomBarLayout = () => (
        <>
            <Outlet/>
            <header>
                <BottomBar/>
            </header>
        </>
    );
    const router = createBrowserRouter([
        {
            element: <BottomBarLayout/>,
            children: [
                {
                    path: "/challenges",
                    element: <ChallengeList/>,
                },
                {
                    path: "/",
                    element: <NewsList/>,
                },
                {
                    path: "/create/challenge",
                    element: <CreateChallenge/>,
                },
                {
                    path: "/create/team",
                    element: <CreateTeam/>,
                },
                {
                    path: "/challenges/:id",
                    element: <Challenge/>,
                },
                {
                    path: "/challenges/:id/edit",
                    element: <EditChallenge/>,
                },
                {
                    path: "/scoreboard",
                    element: <ScoreBoard/>,
                },
                {
                    path: "/teams",
                    element: <TeamsList/>,
                },
                {
                    path: "/teams/:id",
                    element: <Team/>,
                },
                {
                    path: "/teams/:id/edit",
                    element: <EditTeam/>,
                },
                {
                    path: "/account",
                    element: <Account/>,
                },
                {
                    path: "/account/edit",
                    element: <EditProfile/>,
                },
                {
                    path: "/account/challenges",
                    element: <MyChallenges/>,
                },
                {
                    path: "/users/:username",
                    element: <UserDetails/>,
                },
                {
                    path: "/anecdotes",
                    element: <Anecdotes/>,
                },
            ],
        },
        {
            path: "/validations/challenges",
            element: <ChallengeRequest/>,
        },
        {
            path: "/validations/teams",
            element: <TeamRequests/>,
        },
        {
            path: "/login",
            element: <LoginScreen/>,
        },
        {
            path: "/register",
            element: <RegisterScreen/>,
        },
        {
            path: "/resetpassword",
            element: <ResetPasswordScreen/>,
        },
    ]);

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                dispatch(AppActions.setColorMode(mode === "light" ? "dark" : "light"));
            },
        }),
        [mode]
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode]
    );
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <React.Fragment>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                alignItems: "center",
                                backgroundColor: "#e5e5f7",
                                backgroundSize: "11px 11px",
                                backgroundImage: `repeating-linear-gradient(45deg, ${theme.palette.grey[900]} 0, ${theme.palette.grey[900]} 1.1px, ${theme.palette.background.default} 0, ${theme.palette.background.default} 50%)`,
                                padding: 2,
                            }}
                        >
                            <RouterProvider router={router}/>
                            <InstallPWA/>
                        </Box>
                    </Box>
                </React.Fragment>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export {ColorModeContext};
