import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { UserAvatar } from "../../Components/UserAvatar";
import { ColorModeToggle } from "../../Components/ColorModeToggle";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../Reducers";
import { AuthActions, loggedIn } from "../../Reducers/Auth";
import Api from "../../Services/Api";
import { UserActions } from "../../Reducers/User";
import { useNavigate } from "react-router-dom";
import { reduceUserData } from "../../Transforms/User";
import EditIcon from "@mui/icons-material/Edit";
import { useIosInstallPrompt } from "../../Hooks/IosInstallPrompt";
import { useWebInstallPrompt } from "../../Hooks/WebInstallPrompt";
import InstallPWADialog from "../../Components/InstallPWA/InstallPWADialog";
const Account = () => {
  const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));
  const userData = useSelector((state: IState) => state.user);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const userTokens = useSelector((state: IState) => state.auth);
  const [iosInstallPrompt, _handleIOSInstallDeclined] = useIosInstallPrompt(-1);
  const [webInstallPrompt, _handleWebInstallDeclined, handleWebInstallAccepted] =
    useWebInstallPrompt(-1);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);

  React.useEffect(() => {
    console.log(userData);
    if (userLoggedIn) {
      if (userData.mail === "") {
        Api.apiCalls.GET_SELF();
      }
    }
  }, [userLoggedIn]);

  const handleLogout = () => {
    dispatch(AuthActions.logout());
    dispatch(UserActions.logout());
  };

  const handleConnect = () => {
    navigate("/login");
  };

  return (
    <>
      {userLoggedIn ? (
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: `10px 10px 0px black`,
            border: "solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90vw",
            flex: 1,
          }}
        >
          <UserAvatar
            user={reduceUserData(userData)}
            width={150}
            height={150}
          />
          {userData.is_admin && (
            <Typography
              color={theme.palette.warning.main}
              sx={{ fontWeight: 800, textAlign: "center" }}
            >
              Compte administrateur
            </Typography>
          )}
          <Typography
            color={theme.palette.text.primary}
            sx={{ fontWeight: 800, textAlign: "center" }}
          >
            {userData.display_name}
          </Typography>
          <Typography
            color={theme.palette.text.secondary}
            sx={{ fontWeight: 300, textAlign: "center" }}
          >
            {userData.username}
          </Typography>
          <IconButton size="large" onClick={() => navigate("edit")}>
            <EditIcon />
          </IconButton>
          {userData.is_admin ? (
            <>
              <Button
                variant="contained"
                color="warning"
                sx={{
                  marginTop: 5,
                  maxWidth: "300px",
                  width: "100%",
                  borderRadius: 0,
                }}
                onClick={() => navigate("/validations/challenges")}
              >
                Valider des challenges
              </Button>
              <Button
                variant="contained"
                color="warning"
                sx={{
                  marginTop: 2,
                  marginBottom: 5,
                  maxWidth: "300px",
                  width: "100%",
                  borderRadius: 0,
                }}
                onClick={() => navigate("/validations/teams")}
              >
                Accepter dans l'équipe
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{
                marginTop: 2,
                marginBottom: 5,
                maxWidth: "300px",
                width: "100%",
                borderRadius: 0,
              }}
              onClick={() => navigate("challenges")}
            >
              Mes challenges
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            sx={{
              marginTop: "auto",
              marginBottom: theme.spacing(2),
              maxWidth: "300px",
              width: "100%",
              borderRadius: 0,
            }}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
          {iosInstallPrompt ||
            (webInstallPrompt && (
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  marginBottom: theme.spacing(2),
                  maxWidth: "300px",
                  width: "100%",
                  borderRadius: 0,
                }}
                onClick={() => setShowInstallPrompt(true)}
              >
                Installer l'application
              </Button>
            ))}
          <ColorModeToggle />
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: 2,
            maxWidth: "300px",
            width: "100%",
            borderRadius: 0,
          }}
          onClick={handleConnect}
        >
          Me connecter
        </Button>
      )}
      {showInstallPrompt && (
        <InstallPWADialog
          iosInstallPrompt={iosInstallPrompt}
          handleIOSInstallDeclined={() => {
            setShowInstallPrompt(false);
          }}
          webInstallPrompt={webInstallPrompt}
          handleWebInstallAccepted={() => {
            handleWebInstallAccepted();
            setShowInstallPrompt(false);
          }}
          handleWebInstallDeclined={() => {
            setShowInstallPrompt(false);
          }}
        />
      )}
    </>
  );
};

export default Account;
