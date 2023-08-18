import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";
import { AvatarView, HeadShape, IAvatar } from "../../Components/MyAvatar";
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
const Account = () => {
  const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));
  const userDataSet = useSelector((state: IState) => isUserDataSet(state.user));
  const userData = useSelector((state: IState) => state.user);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const avatar: IAvatar = {
    headShape: HeadShape.circle,
  };

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
          <Avatar
            sx={{
              width: 150,
              height: 150,
              pointerEvents: "none",
              marginTop: theme.spacing(4),
            }}
          >
            <AvatarView width={150} height={150} avatar={avatar} />
          </Avatar>
          <Typography
            color={theme.palette.text.primary}
            sx={{ fontWeight: 800, textAlign: "center" }}
          >
            {userData.username}
          </Typography>
          <Typography
            color={theme.palette.text.secondary}
            sx={{ fontWeight: 300, textAlign: "center" }}
          >
            {userData.mail}
          </Typography>
          <ColorModeToggle />
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
