import { Avatar } from "@mui/material";
import React from "react";
import { AvatarView, HeadShape, IAvatar } from "../../Components/MyAvatar";
import { ColorModeToggle } from "../../Components/ColorModeToggle";

const Profile = () => {
  const avatar: IAvatar = {
    headShape: HeadShape.circle,
  };
  return (
    <>
      <Avatar sx={{ width: 150, height: 150, pointerEvents: "none" }}>
        <AvatarView width={150} height={150} avatar={avatar} />
      </Avatar>
      <ColorModeToggle />
    </>
  );
};

export default Profile;
