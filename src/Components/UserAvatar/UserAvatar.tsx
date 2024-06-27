import React from "react";

import {IUserSmallData} from "../../Transforms/User";
import {Avatar} from "@mui/material";
import Api from "../../Services/Api";

interface Props {
    user: IUserSmallData;
    width?: number;
    height?: number;
    imageURL?: string;
    crowned?: boolean;
}

const UserAvatar: React.FC<Props> = (props: Props) => {
    return (
        <>
            <Avatar
                alt={props.user.username}
                src={
                    props.imageURL
                        ? props.imageURL
                        : props.user.picture_id &&
                        Api.apiCalls.GET_PICTURE_URL(props.user.picture_id)
                }
                sx={{border: "solid black", width: props.width, height: props.height}}
            />
            {props.crowned && (
                <div style={{position: "relative"}}>
          <span
              style={{
                  position: "absolute",
                  textAlign: "center",
                  fontSize: 20,
                  left: 2,
                  top: -(props.height || 16),
                  zIndex: 1,
              }}
          >
            👑
          </span>
                </div>
            )}
        </>
    );
};

export default UserAvatar;
