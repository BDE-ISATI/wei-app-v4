import React, { useEffect, useState } from "react";
import "./App.css";
import { createTheme, useTheme } from "@mui/material/styles";

import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";

import { BottomBar } from "./Components/BottomBar";
import { ChallengeList, ScoreBoard, Account } from "./Containers";
import { ThemeProvider } from "@emotion/react";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { LoginScreen } from "./Containers/LoginScreen";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { RegisterScreen } from "./Containers/RegisterScreen";
import { TeamsList } from "./Containers/TeamsList";
import Challenge from "./Containers/Challenge/Challenge";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "./Reducers";
import { AppActions } from "./Reducers/App";
import { EditProfile } from "./Containers/EditProfile";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

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
  const dispatch = useDispatch();

  const BottomBarLayout = () => (
    <>
      <Outlet />
      <header>
        <BottomBar />
      </header>
    </>
  );
  const router = createBrowserRouter([
    {
      element: <BottomBarLayout />,
      children: [
        {
          path: "/",
          element: <RedirectTo path="/challenges" />,
        },
        {
          path: "/challenges",
          element: <ChallengeList />,
        },
        {
          path: "/challenges/:id",
          element: <Challenge />,
        },
        {
          path: "/scoreboard",
          element: <ScoreBoard />,
        },
        {
          path: "/teams",
          element: <TeamsList />,
        },
        {
          path: "/account",
          element: <Account />,
        },
        {
          path: "/account/edit",
          element: <EditProfile />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginScreen />,
    },
    {
      path: "/register",
      element: <RegisterScreen />,
    },
  ]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        dispatch(AppActions.setColorMode(mode === "light" ? "dark" : "light"));
      },
    }),
    []
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
  console.log(theme.palette.background.default);
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
              <RouterProvider router={router} />
            </Box>
          </Box>
        </React.Fragment>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export { ColorModeContext };
