import { Avatar } from "@mui/material";
import React from "react";
import { AvatarView, HeadShape, IAvatar } from "../../Components/MyAvatar";
import { ColorModeToggle } from "../../Components/ColorModeToggle";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../Reducers";
import { AuthActions, loggedIn } from "../../Reducers/Auth";
import Api from "../../Services/Api";
import { LoginScreen } from "../LoginScreen";
const Profile = () => {
  const avatar: IAvatar = {
    headShape: HeadShape.circle,
  };
  const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));
  const dispatch = useDispatch();
  React.useEffect(() => {
    console.log(userLoggedIn);
    if (!userLoggedIn) {
    } else {
      Api.apiCalls.GET_SELF().then((response) => {
        console.log(response?.display_name);
      });
    }
  }, []);
  return (
    <>
      {userLoggedIn ? (
        <>
          <Avatar sx={{ width: 150, height: 150, pointerEvents: "none" }}>
            <AvatarView width={150} height={150} avatar={avatar} />
          </Avatar>
          <ColorModeToggle />
        </>
      ) : (
        <LoginScreen />
      )}
    </>
  );
};

export default Profile;
