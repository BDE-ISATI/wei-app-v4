import React from "react";
import { IUserSmallData } from "../../Transforms/User";
import { AvatarGroup, Badge, Avatar } from "@mui/material";
import UserAvatar from "../UserAvatar/UserAvatar";

interface Props {
  userData: IUserSmallData[];
  max: number;
}

const generateUserAvatar = (users: IUserSmallData[]) => {
  return users.map((user, index) => <UserAvatar user={user} key={index} />);
};

const UserAvatarGroup: React.FC<Props> = (props: Props) => {
  return (
    <AvatarGroup total={props.userData.length} max={props.max}>
      {generateUserAvatar(props.userData)}
    </AvatarGroup>
  );
};

export default UserAvatarGroup;
