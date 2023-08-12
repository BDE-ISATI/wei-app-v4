import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import React, { ReactNode, useState, useEffect } from "react";
import { AvatarView, HeadShape, IAvatar } from "../../Components/MyAvatar";
import { useTheme } from "@mui/material/styles";

interface IUserListItem {
  name: string;
}

const UserListItem = (props: IUserListItem) => {
  const theme = useTheme();
  const avatar: IAvatar = {
    headShape: HeadShape.circle,
  };
  return (
    <ListItem
      sx={{
        color: theme.palette.getContrastText(theme.palette.background.default),
      }}
    >
      <ListItemAvatar>
        <Avatar>
          <AvatarView width={48} height={48} avatar={avatar} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.name} />
    </ListItem>
  );
};

const generateUserList = (users: string[]) => {
  return users.map((value) => (
    <>
      <UserListItem name={value} />
      <Divider component="li" />
    </>
  ));
};

const ScoreBoard = () => {
  const [userList, setUserList] = useState(["Test A", "Test B", "Test C"]);
  return (
    <List
      sx={{
        bgcolor: "background.paper",
        boxShadow: `10px 10px 0px black`,
        border: "solid black",
        width: "250px",
      }}
    >
      {generateUserList(userList)}
    </List>
  );
};

export default ScoreBoard;
