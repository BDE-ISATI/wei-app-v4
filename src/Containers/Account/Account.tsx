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

  console.log(userData);
  React.useEffect(() => {
    console.log(userLoggedIn);
    if (!userLoggedIn) {
    } else {
      if (!userDataSet) {
        Api.apiCalls.GET_SELF().then((response) => {
          if (response.ok) {
            dispatch(UserActions.setUserData(response.data));
          }
        });
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
