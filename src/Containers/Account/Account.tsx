import {
  Avatar,
  Badge,
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
import { isUserDataSet } from "../../Reducers/User";
import Api from "../../Services/Api";
import { LoginScreen } from "../LoginScreen";
import { UserActions } from "../../Reducers/User";
import RegisterScreen from "../RegisterScreen/RegisterScreen";
import { useNavigate } from "react-router-dom";
import { reduceUserData } from "../../Transforms/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditIcon from "@mui/icons-material/Edit";
const Account = () => {
  const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));
  const userDataSet = useSelector((state: IState) => isUserDataSet(state.user));
  const userData = useSelector((state: IState) => state.user);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userTokens = useSelector((state: IState) => state.auth);

  React.useEffect(() => {
    if (!userLoggedIn) {
    } else {
      if (!userDataSet) {
        Api.apiCalls.GET_SELF();
      }
    }
  }, []);

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
          {userData.is_admin && (
            <Button
              variant="contained"
              color="warning"
              sx={{
                marginTop: 5,
                marginBottom: 5,
                maxWidth: "300px",
                width: "100%",
                borderRadius: 0,
              }}
              onClick={() => navigate("/validation")}
            >
              Validations en attente
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
          <ColorModeToggle />
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: "auto",
            maxWidth: "300px",
            width: "100%",
            borderRadius: 0,
          }}
          onClick={handleConnect}
        >
          Me connecter
        </Button>
      )}
    </>
  );
};

export default Account;