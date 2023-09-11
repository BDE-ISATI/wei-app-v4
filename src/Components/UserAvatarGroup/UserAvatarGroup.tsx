import React from "react";
import { IUserSmallData } from "../../Transforms/User";
import { AvatarGroup, Badge, Avatar } from "@mui/material";
import UserAvatar from "../UserAvatar/UserAvatar";

interface Props {
  userData: IUserSmallData[];
  max: number;
  showCrown?: boolean;
}

const generateUserAvatar = (users: IUserSmallData[], showCrown?: boolean) => {
  return users.map((user, index) => (
    <UserAvatar user={user} key={index} crowned={index === 0 && showCrown} />
  ));
};

const UserAvatarGroup: React.FC<Props> = (props: Props) => {
  return (
    <AvatarGroup total={props.userData.length} max={props.max}>
      {generateUserAvatar(props.userData, props.showCrown)}
    </AvatarGroup>
  );
};

export default UserAvatarGroup;
