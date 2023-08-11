import React, { useState } from "react";
import "./App.css";
import { createTheme, useTheme } from "@mui/material/styles";

import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";

import { BottomBar } from "./Components/BottomBar";
import { ChallengeList, ScoreBoard, Profile } from "./Containers";
import { ThemeProvider } from "@emotion/react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./Reducers";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export default function App() {
  const [page, setPage] = useState(0);
  const [mode, setMode] = React.useState<"light" | "dark">("dark");

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
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
    <Provider store={store}>
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
                {page === 0 && <ChallengeList />}
                {page === 1 && <ScoreBoard />}
                {page === 2 && <Profile />}
              </Box>
              <BottomBar onPageChanged={(x: number) => setPage(x)} />
            </Box>
          </React.Fragment>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  );
}

export { ColorModeContext };
