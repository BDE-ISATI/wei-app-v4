import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { ReactNode, useState, useEffect } from "react";
import { UserAvatar } from "../../Components/UserAvatar";
import { useTheme } from "@mui/material/styles";
import Api from "../../Services/Api";
import { IUserData } from "../../Transforms";
import { reduceUserData } from "../../Transforms/User";

interface IUserListItem {
  user: IUserData;
  rank: number;
}

const UserListItem = (props: IUserListItem) => {
  const theme = useTheme();
  return (
    <ListItem
      sx={{
        color: theme.palette.getContrastText(theme.palette.background.default),
      }}
    >
      <Typography sx={{ marginRight: 2 }}>{props.rank + 1}</Typography>
      <ListItemAvatar>
        <UserAvatar user={reduceUserData(props.user)} />
      </ListItemAvatar>
      <ListItemText
        primary={props.user.display_name}
        secondary={
          props.user.points + " point" + (props.user.points > 1 ? "s" : "")
        }
      />
    </ListItem>
  );
};

const generateUserList = (users: IUserData[] | undefined) => {
  if (users === undefined) {
    return <></>;
  }
  return users
    .sort((a: IUserData, b: IUserData) => {
      return b.points - a.points;
    })
    .filter((data, index) => {
      return data.show;
    })
    .map((data, index) => (
      <div key={index}>
        <UserListItem user={data} rank={index} />
        <Divider component="li" />
      </div>
    ));
};

const ScoreBoard = () => {
  const [userList, setUserList] = useState<IUserData[] | undefined>();
  const theme = useTheme();
  React.useEffect(() => {
    Api.apiCalls.GET_ALL_USERS().then((response) => {
      if (response.ok) {
        setUserList(response.data);
      }
    });
  }, []);
  return (
    <div>
      <List
        sx={{
          bgcolor: "background.paper",
          boxShadow: `10px 10px 0px black`,
          border: "solid black",
          width: "500px",
          maxWidth: "90vw",
        }}
      >
        {generateUserList(userList)}
      </List>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={userList === undefined}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default ScoreBoard;
