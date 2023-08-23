import React from "react";

import { IUserSmallData } from "../../Transforms/User";
import { Avatar } from "@mui/material";
import Api from "../../Services/Api";

interface Props {
  user: IUserSmallData;
  width?: number;
  height?: number;
  imageURL?: string;
}

const UserAvatar: React.FC<Props> = (props: Props) => {
  return (
    <Avatar
      alt={props.user.username}
      src={
        props.imageURL
          ? props.imageURL
          : props.user.picture_id &&
            Api.apiCalls.GET_PICTURE_URL(props.user.picture_id)
      }
      sx={{ border: "solid black", width: props.width, height: props.height }}
    />
  );
};

export default UserAvatar;
